"""Prepara as imagens do site (assets/img) e gera js/images.js com legenda, ficha e crédito de cada uma.

uso: python3 scripts/imagens.py <pasta-com-os-originais>
Os originais vêm do Wikimedia Commons: a ficha de cada um (terceiro campo) é o nome do arquivo lá.
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
    'pedro-ii-1840': ('pedro2_1840_barandier.jpg', 900, (0.009114583333333334, 0.006952491309385863, 0.9893229166666667, 0.9920818848976439), 'Claude_Joseph_Barandier_–_Pedro_II_em_sua_maioridade_(1840).jpg', 'Claude Joseph Barandier, retrato de D. Pedro II no ano da maioridade, 1840. Óleo sobre tela; ao fundo, o portal do Paço de São Cristóvão.', 'C. J. Barandier, D. Pedro II (1840)'),
    'pedro-ii-1876': ('pedro2_brady.jpg', 1500, None, 'Pedro_II_of_Brazil_-_Brady-Handy.jpg', 'D. Pedro II em 1876, durante a viagem aos Estados Unidos. Fotografia do estúdio de Mathew Brady (Brady-Handy Collection, Library of Congress).', 'Estúdio de Mathew Brady, D. Pedro II (1876)'),
    'fala-do-trono': ('fala_trono.jpg', 1100, None, 'Pedro_Américo_-_D._Pedro_II_na_abertura_da_Assembléia_Geral.jpg', 'Pedro Américo, D. Pedro II na abertura da Assembleia Geral (Fala do Trono), 1872. Óleo; Museu Imperial, Petrópolis.', 'Pedro Américo, Fala do Trono (1872)'),
    'constituicao-1824': ('constituicao_capa.jpg', 900, None, '00_Constituição_do_Império_do_Brasil.jpg', 'Capa da Constituição Política do Império do Brasil, de 1824. Arquivo Nacional.', 'Constituição do Império do Brasil (1824), Arquivo Nacional'),
    'colheita-cafe-1883': ('ferrez_colheita_1883.jpg', 1100, None, 'Escravos_colhendo_café.jpg', 'Marc Ferrez, escravizados colhendo café no Vale do Paraíba, 1883.', 'Marc Ferrez, Colheita de café (1883)'),
    'porto-santos-1880': ('santos_cafe_1880.jpg', 1300, None, 'Cafe_porto_Santos_1880.jpg', 'Marc Ferrez, embarque de café no porto de Santos, c. 1880.', 'Marc Ferrez, Café no porto de Santos (c. 1880)'),
    'ferrovia-santos-1870': ('ef_santos_1870.jpg', 1600, None, 'Estrada_de_Ferro_Santos-São_Paulo,_1870.jpg', 'Marc Ferrez, Estrada de Ferro Santos–São Paulo (São Paulo Railway) na serra, 1870. Biblioteca Mário de Andrade.', 'Marc Ferrez, Estrada de Ferro Santos–São Paulo (1870)'),
    'batalha-avai': ('avai.jpg', 1920, None, 'Pedro_Américo_-_Batalha_do_Avaí.jpg', 'Pedro Américo, Batalha do Avaí, 1872–1877. Óleo; Museu Nacional de Belas Artes. Pintura monumental posterior à guerra.', 'Pedro Américo, Batalha do Avaí (1872–1877)'),
    'voluntario-1865': ('corporal_1865.jpg', 800, None, 'Brazilian_corporal_of_the_1st_Fatherland_Volunteer_battalion.jpg', 'Furriel Luiz Antonio de Vargas, do 1º Batalhão de Voluntários da Pátria, 1865. Fotografia colorida à mão.', 'Furriel Luiz Antonio de Vargas, Voluntários da Pátria (1865)'),
    'luiz-gama': ('luiz_gama.jpg', 600, None, 'Luiz_Gama_perfil.jpg', 'Luiz Gama (1830–1882), jornalista, advogado e abolicionista. Arquivo Nacional.', 'Luiz Gama, Arquivo Nacional'),
    'jose-do-patrocinio': ('patrocinio.jpg', 600, None, 'Alberto_Henschel_-_Retrato_de_Jose_do_Patrocinio.jpg', 'José do Patrocínio, jornalista e abolicionista, fotografado por Alberto Henschel (antes de 1882).', 'Alberto Henschel, José do Patrocínio (antes de 1882)'),
    'andre-reboucas': ('reboucas.jpg', 600, None, 'André_Rebouças_(cropped).jpg', 'André Rebouças, engenheiro e abolicionista, 1871.', 'André Rebouças (1871)'),
    'joaquim-nabuco': ('nabuco.jpg', 600, None, 'Joaquim_Nabuco_around_1886.jpg', 'Joaquim Nabuco, deputado por Pernambuco, c. 1886. Fotografia de Alfredo Ducasble.', 'Alfredo Ducasble, Joaquim Nabuco (c. 1886)'),
    'multidao-13-maio': ('getty_abolicao.jpg', 1920, (0, 0.02, 1, 1), 'Gilberto_Ferrez,_Getty_Museum,_Abolition_of_slavery_by_Princess_Isabel_of_Bresil,_1888.png', 'Marc Ferrez, multidão no centro do Rio de Janeiro em 13 de maio de 1888, dia da assinatura da Lei Áurea. Coleção Gilberto Ferrez, Getty Research Institute.', 'Marc Ferrez, 13 de maio de 1888 (Getty Research Institute)'),
    'proclamacao-calixto': ('calixto.jpg', 1920, None, 'Proclamação_da_República_by_Benedito_Calixto_1893.jpg', 'Benedito Calixto, Proclamação da República, 1893. Pinacoteca do Estado de São Paulo. Representação pintada quatro anos depois dos fatos.', 'Benedito Calixto, Proclamação da República (1893)'),
    'a-republica-1870': ('republica_1870.jpg', 1100, None, 'A-republica-3-12-1870.jpg', 'Primeira página do jornal A República, n. 1, Rio de Janeiro, 3 de dezembro de 1870, que publicou o Manifesto Republicano.', 'A República, n. 1 (3 dez. 1870)'),
    'coroacao-1841': ('coroacao_portoalegre.jpg', 1920, None, 'Coroação_de_Pedro_II_(_Manuel_de_Araújo_Porto-Alegre).png', 'Manuel de Araújo Porto-Alegre, estudo para a coroação de D. Pedro II (c. 1840–1841). Representação artística da cerimônia de 18 de julho de 1841, na Capela Imperial do Rio de Janeiro.', 'M. de Araújo Porto-Alegre, Coroação de D. Pedro II (c. 1840–1841)'),
    'camara-1866': ('camara_1866.jpg', 1920, None, 'S._M._O_IMPERADOR_E_A_CAMARA_DOS_DEPUTADOS_EM_1866.jpg', 'Carlos Linde, S. M. o Imperador e a Câmara dos Deputados em 1866. Composição com os retratos dos deputados ao redor de D. Pedro II.', 'Carlos Linde, O Imperador e a Câmara dos Deputados (1866)'),
    'feijo': ('feijo_sisson.jpg', 700, None, 'Diogo_Antônio_Feijó.jpg', 'Diogo Antônio Feijó (1784–1843), regente do Império de 1835 a 1837. Litografia de S. A. Sisson.', 'S. A. Sisson, Regente Feijó'),
    'litran-farroupilha': ('litran_farroupilha.jpg', 1400, None, 'Carga_de_Cavalaria_by_Guilherme_Litran.jpg', 'Guilherme Litran, Carga de cavalaria farroupilha, 1893. Óleo sobre tela; representação artística feita meio século depois da revolta.', 'Guilherme Litran, Carga de cavalaria (1893)'),
    'teresa-cristina': ('teresa_cristina.jpg', 800, (0.14, 0.11, 0.86, 0.89), 'Imperatriz_Dona_Teresa_Cristina_por_Édouard_Viénot.jpg', 'Édouard Viénot, retrato da imperatriz Teresa Cristina (1822–1889), mulher de D. Pedro II, c. 1860. Óleo sobre tela.', 'Édouard Viénot, Teresa Cristina (c. 1860)'),
    'marques-parana': ('parana_bauch.jpg', 700, None, 'Marquis_of_Parana_by_Emilio_Bauch.jpg', 'Emil Bauch, retrato de Honório Hermeto Carneiro Leão, marquês de Paraná, chefe do Gabinete da Conciliação, c. 1855–1856.', 'Emil Bauch, Marquês de Paraná (c. 1856)'),
    'caxias': ('caxias_petit.jpg', 800, None, 'Auguste_Petit_-_Retrato_do_Duque_de_Caxias_(1881).jpg', 'Auguste Petit, retrato de Luís Alves de Lima e Silva, duque de Caxias, 1881. Acervo do Superior Tribunal Militar.', 'Auguste Petit, Duque de Caxias (1881)'),
    'navio-negreiro': ('rugendas_navio.jpg', 1920, None, 'Navio_Negreiro_by_Johann_Moritz_Rugendas_(1830)_(no_borders).jpg', 'Johann Moritz Rugendas, Navio negreiro (Nègres à fond de cale), c. 1830. Litografia do livro Viagem pitoresca através do Brasil; o olhar é o de um viajante europeu.', 'J. M. Rugendas, Navio negreiro (c. 1830)'),
    'ganhador-1865': ('christiano_1865.jpg', 800, None, 'Slave_Brazil_1865.jpg', 'Christiano Júnior, trabalhador escravizado no Rio de Janeiro, 1865. Os “escravos de ganho” faziam serviços na rua e entregavam parte do pagamento ao senhor.', 'Christiano Júnior, Rio de Janeiro (1865)'),
    'hospedaria-1888': ('hospedaria_1888.jpg', 1600, None, 'Hospedaria_dos_Imigrantes_do_Brás.jpg', 'Página do livro de matrícula da Hospedaria dos Imigrantes do Brás, São Paulo, 7 de abril de 1888.', 'Livro da Hospedaria dos Imigrantes (1888)'),
    'maua': ('maua.jpg', 800, None, 'Irineu-Evangelista-de-Sousa.jpg', 'Irineu Evangelista de Sousa (1813–1889), barão e depois visconde de Mauá. Retrato publicado em 1898.', 'Visconde de Mauá, retrato publicado em 1898'),
    'primeira-missa': ('primeira_missa.jpg', 1600, None, 'Meirelles-primeiramissa2.jpg', 'Victor Meirelles, Primeira Missa no Brasil, 1860. Óleo sobre tela, Museu Nacional de Belas Artes. Pintura histórica: representação de 1500 feita no século XIX.', 'Victor Meirelles, Primeira Missa no Brasil (1860)'),
    'iracema': ('iracema.jpg', 1920, None, 'Iracema.jpg', 'José Maria de Medeiros, Iracema, década de 1880. Óleo sobre tela inspirado no romance de José de Alencar (1865).', 'José Maria de Medeiros, Iracema (déc. de 1880)'),
    'goncalves-dias': ('goncalves_dias.jpg', 700, None, 'Gonçalves_dias.jpg', 'Antônio Gonçalves Dias (1823–1864), poeta romântico, autor da Canção do exílio. Retrato de c. 1855.', 'Gonçalves Dias (c. 1855)'),
    'carlos-gomes': ('carlos_gomes.jpg', 700, None, 'Antônio_Carlos_Gomes,_c1870.jpg', 'Antônio Carlos Gomes (1836–1896), compositor da ópera Il Guarany (1870). Retrato de estúdio, c. 1870.', 'Carlos Gomes (c. 1870)'),
    'machado-1864': ('machado_1864.jpg', 700, None, 'Machado_de_Assis_25_anos.jpg', 'Joaquim Insley Pacheco, Machado de Assis aos 25 anos, 1864.', 'Insley Pacheco, Machado de Assis (1864)'),
    'caseros-1852': ('caseros_iln.jpg', 1400, None, 'Batalla_de_Caseros_3_Febrero_1852.jpg', 'A Batalha de Monte Caseros (3 de fevereiro de 1852), com a 1ª Divisão brasileira em destaque. Gravura publicada no Illustrated London News em 4 de dezembro de 1852.', 'Illustrated London News, Batalha de Caseros (1852)'),
    'riachuelo': ('riachuelo_meirelles.jpg', 1400, None, 'Victor_Meirelles_-_Combate_Naval_do_Riachuelo.JPG', 'Victor Meirelles, Combate Naval do Riachuelo (batalha de 11 de junho de 1865). Óleo sobre tela.', 'Victor Meirelles, Combate Naval do Riachuelo'),
    'pedro-ii-1891': ('nadar_1891.jpg', 900, None, 'Pedro_II_of_Brazil_by_Nadar.jpg', 'Ateliê Nadar, D. Pedro II em Paris, 1891, o ano de sua morte no exílio.', 'Ateliê Nadar, D. Pedro II (1891)'),
}

LICENSE = {"andre-reboucas": "domínio público (foto de 1871)"}

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
