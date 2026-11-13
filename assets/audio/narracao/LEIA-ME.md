# Narração — como adicionar as gravações

A apresentação já tem player de narração: iniciar e pausar, repetir, avançar, sincronizar as etapas das cenas, avançar sozinha ao terminar, silenciar e controlar o volume. **Ainda não há nenhuma gravação.** Por isso o botão de narração aparece desativado e o painel de áudio avisa que falta gravar.

Nada aqui usa voz sintética. A narração só funciona com gravações reais feitas pelo grupo.

## 1. Gravar

Cada slide tem um texto pronto para ler: o campo **“Fala”** em `ROTEIRO.md`, também visível no modo apresentador (tecla **P**). Nas cenas com etapas, leia também o texto de cada etapa, na ordem.

Dicas:

- grave em lugar silencioso, com o celular a uns 20 cm da boca;
- deixe 1 segundo de silêncio no começo e no fim;
- salve em **MP3** (ou M4A/OGG).

## 2. Nomear os arquivos e colocá-los nesta pasta

| Slide | id | Nome sugerido |
|---|---|---|
| 1 | abertura | `01-abertura.mp3` |
| 2 | contexto | `02-contexto.mp3` |
| 3 | causas | `03-causas.mp3` |
| 4 | paises | `04-paises.mp3` |
| 5 | inicio | `05-inicio.mp3` (5 etapas) |
| 6 | alianca | `06-alianca.mp3` (5 etapas) |
| 7 | cronologia | `07-cronologia.mp3` |
| 8 | mapa | `08-mapa.mp3` (5 fases) |
| 9 | batalhas | `09-batalhas.mp3` (5 batalhas) |
| 10 | humanas | `10-humanas.mp3` |
| 11 | politicas | `11-politicas.mp3` |
| 12 | interpretacoes | `12-interpretacoes.mp3` |
| 13 | conclusao | `13-conclusao.mp3` |
| 14 | referencias | `14-referencias.mp3` |

## 3. Registrar no `manifest.json`

Liste apenas as gravações que existem de verdade:

```json
{
  "slides": {
    "abertura": { "arquivo": "01-abertura.mp3" },
    "inicio":   { "arquivo": "05-inicio.mp3", "etapas": [14, 29, 41, 55] },
    "mapa":     { "arquivo": "08-mapa.mp3",   "etapas": [22, 47, 70, 92] }
  }
}
```

`etapas` é opcional. Ele lista os segundos da gravação em que começa cada etapa **seguinte** da cena: etapa 2, etapa 3 e assim por diante. Com a opção “Sincronizar etapas” ligada no painel de áudio, o mapa e as cenas avançam sozinhos nesses momentos. Para descobrir os tempos, ouça a gravação num player e anote os segundos.

## 4. Testar

Abra a apresentação e clique no ícone de som, no canto superior direito, ou use a tecla **A**. Depois clique em **Iniciar**. A narração nunca começa sozinha. Com ela ativa, a gravação de cada slide começa logo depois da transição.
