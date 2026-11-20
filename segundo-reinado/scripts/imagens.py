"""Prepara as imagens do site (assets/img) e gera js/images.js com legenda, ficha e crédito de cada uma.

uso: python3 scripts/imagens.py <pasta-com-os-originais>
Os originais vêm do Wikimedia Commons (lista em fonte/imagens.tsv; baixar com fonte/baixar_imagens.py).
"""
import json
import os
import sys

from PIL import Image, ImageOps

RAW = sys.argv[1] if len(sys.argv) > 1 else "../originais"
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
OUT = os.path.join(SITE, "assets", "img")
os.makedirs(OUT, exist_ok=True)

# chave: (arquivo original, largura máx., recorte [l,t,r,b] em fração ou None,
#         ficha no Commons, legenda completa, crédito curto)
IMAGES = {
    "pedro-ii-1876": ("pedro2_brady.jpg", 1500, None, "Pedro_II_of_Brazil_-_Brady-Handy.jpg",
        "D. Pedro II em 1876, durante a viagem aos Estados Unidos. Fotografia do estúdio de Mathew Brady (Brady-Handy Collection, Library of Congress).",
        "Estúdio de Mathew Brady, D. Pedro II (1876)"),
    "pedro-ii-1840": ("pedro2_1840_barandier.jpg", 900, (35 / 3840, 36 / 5178, 3799 / 3840, 5137 / 5178), "Claude_Joseph_Barandier_–_Pedro_II_em_sua_maioridade_(1840).jpg",
        "Claude Joseph Barandier, retrato de D. Pedro II no ano da maioridade, 1840. Óleo sobre tela; ao fundo, o portal do Paço de São Cristóvão.",
        "C. J. Barandier, D. Pedro II (1840)"),
    "fala-do-trono": ("fala_trono.jpg", 1100, None, "Pedro_Américo_-_D._Pedro_II_na_abertura_da_Assembléia_Geral.jpg",
        "Pedro Américo, D. Pedro II na abertura da Assembleia Geral (Fala do Trono), 1872. Óleo; Museu Imperial, Petrópolis.",
        "Pedro Américo, Fala do Trono (1872)"),
    "colheita-cafe-1883": ("ferrez_colheita_1883.jpg", 1100, None, "Escravos_colhendo_café.jpg",
        "Marc Ferrez, escravizados colhendo café no Vale do Paraíba, 1883.",
        "Marc Ferrez, Colheita de café (1883)"),
    "ferrovia-santos-1870": ("ef_santos_1870.jpg", 1600, None, "Estrada_de_Ferro_Santos-São_Paulo,_1870.jpg",
        "Marc Ferrez, Estrada de Ferro Santos–São Paulo (São Paulo Railway) na serra, 1870. Biblioteca Mário de Andrade.",
        "Marc Ferrez, Estrada de Ferro Santos–São Paulo (1870)"),
    "porto-santos-1880": ("santos_cafe_1880.jpg", 1300, None, "Cafe_porto_Santos_1880.jpg",
        "Marc Ferrez, embarque de café no porto de Santos, c. 1880.",
        "Marc Ferrez, Café no porto de Santos (c. 1880)"),
    "rua-do-ouvidor": ("ouvidor_1.jpg", 1000, (.05, .04, .95, .96), "Rua_do_Ouvidor_-_1.jpg",
        "Marc Ferrez, Rua do Ouvidor, Rio de Janeiro (sem data). Instituto Moreira Salles.",
        "Marc Ferrez, Rua do Ouvidor (s. d.)"),
    "batalha-avai": ("avai.jpg", 1920, None, "Pedro_Américo_-_Batalha_do_Avaí.jpg",
        "Pedro Américo, Batalha do Avaí, 1872–1877. Óleo; Museu Nacional de Belas Artes. Pintura monumental posterior à guerra.",
        "Pedro Américo, Batalha do Avaí (1872–1877)"),
    "voluntario-1865": ("corporal_1865.jpg", 800, None, "Brazilian_corporal_of_the_1st_Fatherland_Volunteer_battalion.jpg",
        "Furriel Luiz Antonio de Vargas, do 1º Batalhão de Voluntários da Pátria, 1865. Fotografia colorida à mão.",
        "Furriel Luiz Antonio de Vargas, Voluntários da Pátria (1865)"),
    "de-volta-agostini": ("de_volta_agostini.jpg", 400, (0, 0, 1, .78), "Angelo_Agostini,_1870,_De_Volta_do_Paraguai.jpg",
        "Angelo Agostini, De volta do Paraguai, 1870 (A Vida Fluminense). O voluntário negro retorna e encontra a mãe castigada: crítica à escravidão.",
        "Angelo Agostini, De volta do Paraguai (1870)"),
    "macedo-costa-pintura": ("macedo_costa_1870s.jpg", 900, None, "Autor_não_identificado_-_Retrato_de_Dom_Macedo_Costa,_anos_1870.jpg",
        "Retrato de D. Antônio de Macedo Costa, bispo do Pará, década de 1870. Óleo, autor não identificado; acervo da Catedral de Belém.",
        "Retrato de D. Macedo Costa (déc. 1870)"),
    "sena-madureira": ("sena_madureira.jpg", 800, None, "Antônio_de_Sena_Madureira.jpg",
        "Tenente-coronel Antônio de Sena Madureira, década de 1880. Fotografia de autoria desconhecida.",
        "Ten.-cel. Sena Madureira (déc. 1880)"),
    "fazenda-cafe-1885": ("ferrez_cafe_1885.jpg", 1400, None, "Slaves_in_coffee_farm_by_marc_ferrez_1885.jpg",
        "Marc Ferrez, escravizados em fazenda de café, c. 1885.",
        "Marc Ferrez, Escravizados em fazenda de café (c. 1885)"),
    "constituicao-1824": ("constituicao_capa.jpg", 900, None, "00_Constituição_do_Império_do_Brasil.jpg",
        "Capa da Constituição Política do Império do Brasil, de 1824. Arquivo Nacional.",
        "Constituição do Império do Brasil (1824), Arquivo Nacional"),
    "pio-ix": ("pio_ix.jpg", 700, None, "Pius_IX,_by_Adolphe_Braun,_1875.jpg",
        "O papa Pio IX fotografado por Adolphe Braun, 1875.",
        "Adolphe Braun, Pio IX (1875)"),
    "dom-vital": ("vital_mp.jpg", 700, None, "9747R_-_Frei_Vital_(Bispo_Olinda)_-_01,_Acervo_do_Museu_Paulista_da_USP.jpg",
        "Frei Vital, bispo de Olinda, fotografado por Militão Augusto de Azevedo em 1879. Museu Paulista da USP.",
        "Militão A. de Azevedo, Frei Vital (1879)"),
    "macedo-costa": ("macedo_costa.jpg", 700, None, "Dom_Antônio_de_Macedo_Costa,_sem_data.tif",
        "D. Antônio de Macedo Costa, bispo do Pará. Fotografia sem data; Arquivo Nacional, fundo Correio da Manhã.",
        "D. Antônio de Macedo Costa (s. d.), Arquivo Nacional"),
    "rio-branco": ("rio_branco_1879.jpg", 700, None, "Visconde_do_Rio_Branco_1879.jpg",
        "José Maria da Silva Paranhos, visconde do Rio Branco, fotografado por Alberto Henschel em 1879.",
        "Alberto Henschel, Visconde do Rio Branco (1879)"),
    "caricatura-1876": ("caricatura_vital.jpg", 1400, None, "Monsenhor_Pinto_de_Campos_suspenso_pelo_Bispo_de_Olinda_por_celebrar_o_casamento_de_um_maçom._E_muito_bem_feito_..._ou_bem_Cesar_ou_bem_João_Fernandes.jpg",
        "Angelo Agostini, Revista Illustrada, 1º dez. 1876: o bispo de Olinda suspende o monsenhor Pinto de Campos por celebrar o casamento de um maçom.",
        "Angelo Agostini, Revista Illustrada (1876)"),
    "deodoro-1889": ("deodoro_1889.jpg", 1100, None, "Deodoro_da_Fonseca_(1889).jpg",
        "Marechal Deodoro da Fonseca, retrato oficial de 1889 (Galeria dos Presidentes).",
        "Deodoro da Fonseca, retrato oficial (1889)"),
    "comte": ("comte_daguerreo.jpg", 700, None, "Auguste_Comte_daguerreotype.jpeg",
        "Auguste Comte, daguerreótipo de 1849.",
        "Auguste Comte, daguerreótipo (1849)"),
    "escola-militar": ("praia_vermelha.jpg", 1400, (.04, .05, .96, .93), "Escola_Militar_da_Praia_Vermelha_(0072137cx019-07).jpg",
        "Escola Militar da Praia Vermelha, Rio de Janeiro, c. 1885–1895. Instituto Moreira Salles.",
        "Escola Militar da Praia Vermelha (c. 1885–1895), IMS"),
    "benjamin-constant": ("benjamin_constant.jpg", 800, (0, 0, 1, .62), "Benjamin_Constant.tif",
        "Benjamin Constant Botelho de Magalhães, 1889. Arquivo Nacional, fundo Agência Nacional.",
        "Benjamin Constant (1889), Arquivo Nacional"),
    "bandeira-1889": ("flag_1889.png", 900, None, "Flag_of_Brazil_(1889–1960).svg",
        "Bandeira republicana adotada em 19 de novembro de 1889, com o lema positivista “Ordem e Progresso”. Desenho de Raimundo Teixeira Mendes.",
        "Bandeira do Brasil (1889)"),
    "luiz-gama": ("luiz_gama.jpg", 600, None, "Luiz_Gama_perfil.jpg",
        "Luiz Gama (1830–1882), jornalista, advogado e abolicionista. Arquivo Nacional.",
        "Luiz Gama, Arquivo Nacional"),
    "jose-do-patrocinio": ("patrocinio.jpg", 600, None, "Alberto_Henschel_-_Retrato_de_Jose_do_Patrocinio.jpg",
        "José do Patrocínio, jornalista e abolicionista, fotografado por Alberto Henschel (antes de 1882).",
        "Alberto Henschel, José do Patrocínio (antes de 1882)"),
    "andre-reboucas": ("reboucas.jpg", 600, None, "André_Rebouças_(cropped).jpg",
        "André Rebouças, engenheiro e abolicionista, 1871.",
        "André Rebouças (1871)"),
    "joaquim-nabuco": ("nabuco.jpg", 600, None, "Joaquim_Nabuco_around_1886.jpg",
        "Joaquim Nabuco, deputado por Pernambuco, c. 1886. Fotografia de Alfredo Ducasble.",
        "Alfredo Ducasble, Joaquim Nabuco (c. 1886)"),
    "dragao-do-mar": ("dragao_do_mar.jpg", 900, None, "Quadro_de_Dragão_do_Mar.jpg",
        "Angelo Agostini, homenagem ao jangadeiro Francisco José do Nascimento, o Dragão do Mar (Revista Illustrada, 1884).",
        "Angelo Agostini, Dragão do Mar (1884)"),
    "multidao-13-maio": ("getty_abolicao.jpg", 1920, (0, .02, 1, 1), "Gilberto_Ferrez,_Getty_Museum,_Abolition_of_slavery_by_Princess_Isabel_of_Bresil,_1888.png",
        "Marc Ferrez, multidão no centro do Rio de Janeiro em 13 de maio de 1888, dia da assinatura da Lei Áurea. Coleção Gilberto Ferrez, Getty Research Institute.",
        "Marc Ferrez, 13 de maio de 1888 (Getty Research Institute)"),
    "terreiro-cafe-1882": ("ferrez_cafe_1882.jpg", 1600, None, "Slaves_working_on_a_coffee_plantation_01.jpg",
        "Marc Ferrez, escravizados em terreiro de café no Vale do Paraíba, c. 1882.",
        "Marc Ferrez, Terreiro de café (c. 1882)"),
    "a-republica-1870": ("republica_1870.jpg", 1100, None, "A-republica-3-12-1870.jpg",
        "Primeira página do jornal A República, n. 1, Rio de Janeiro, 3 de dezembro de 1870, que publicou o Manifesto Republicano.",
        "A República, n. 1 (3 dez. 1870)"),
    "baile-ilha-fiscal": ("baile_ilha_fiscal.jpg", 1600, (.03, .05, .97, .92), "A_ilusão_do_Terceiro_Reinado_ou_O_último_baile_da_Ilha_Fiscal,_por_Aurélio_de_Figueiredo,_da_coleção_Museu_Histórico_Nacional.jpg",
        "Aurélio de Figueiredo, A ilusão do Terceiro Reinado (O último baile da Ilha Fiscal), 1905. Museu Histórico Nacional. Foto da obra: Jonas de Carvalho (CC BY-SA 2.0).",
        "Aurélio de Figueiredo, O último baile da Ilha Fiscal (1905) · foto CC BY-SA 2.0"),
    "proclamacao-calixto": ("calixto.jpg", 1920, None, "Proclamação_da_República_by_Benedito_Calixto_1893.jpg",
        "Benedito Calixto, Proclamação da República, 1893. Pinacoteca do Estado de São Paulo. Representação pintada quatro anos depois dos fatos.",
        "Benedito Calixto, Proclamação da República (1893)"),
    "ouro-preto": ("ouro_preto_c1889.jpg", 600, None, "Afonso_Celso_de_Assis_Figueiredo_(Visconde_de_Ouro_Preto)_c_1889.jpg",
        "Afonso Celso de Assis Figueiredo, visconde de Ouro Preto, último presidente do Conselho de Ministros do Império, c. 1889.",
        "Visconde de Ouro Preto (c. 1889)"),
    "familia-imperial-1889": ("familia_imperial_1889.jpg", 1000, None, "Família_Imperial_por_Otto_Hees-Restoration.jpg",
        "Otto Hees, D. Pedro II e a família imperial, 1889: a imperatriz Teresa Cristina, D. Antônio, a princesa Isabel, o imperador, D. Pedro Augusto, D. Luís, o conde d’Eu e D. Pedro de Alcântara.",
        "Otto Hees, A família imperial (1889)"),
    "aristides-lobo": ("aristides_lobo.jpg", 500, None, "Aristide_Lobo.JPG",
        "Aristides Lobo, republicano e ministro do Interior do Governo Provisório. Gravura em A Pátria Brazileira.",
        "Aristides Lobo, gravura"),
}

LICENSE = {"baile-ilha-fiscal": "domínio público; foto CC BY-SA 2.0", "andre-reboucas": "domínio público (foto de 1871)"}

reg = {}
for key, (src, maxw, crop, commons, caption, short) in IMAGES.items():
    path = os.path.join(RAW, src)
    im = ImageOps.exif_transpose(Image.open(path))
    png = src.endswith(".png") and key == "bandeira-1889"
    if im.mode in ("RGBA", "LA", "P") and not png:
        bg = Image.new("RGB", im.size, (255, 255, 255))
        rgba = im.convert("RGBA")
        bg.paste(rgba, mask=rgba.split()[-1])
        im = bg
    if crop:
        w, h = im.size
        im = im.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
    if im.width > maxw:
        im = im.resize((maxw, round(maxw * im.height / im.width)), Image.LANCZOS)
    if png:
        out = os.path.join(OUT, key + ".png")
        im.save(out, optimize=True)
    else:
        out = os.path.join(OUT, key + ".jpg")
        im.convert("RGB").save(out, quality=82, optimize=True, progressive=True)
    reg[key] = [caption, commons, short, LICENSE.get(key, "domínio público"), "png" if png else "jpg", im.width, im.height]
    print(f"{key}: {im.size} {os.path.getsize(out) // 1024} KB")

js = ("/* Registro das imagens: legenda, ficha no Wikimedia Commons, crédito curto, licença, formato e tamanho.\n"
      "   Gerado por scripts/imagens.py — não edite à mão. */\n"
      "window.GP = window.GP || {};\nwindow.GP.IMAGES = " + json.dumps(reg, ensure_ascii=False, indent=1) + ";\n")
open(os.path.join(SITE, "js", "images.js"), "w", encoding="utf-8").write(js)
print("js/images.js:", len(reg), "imagens")
