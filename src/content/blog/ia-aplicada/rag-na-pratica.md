---
title: "RAG na prática: como dar memória e contexto a um LLM"
description: "Entenda em poucos minutos o que são chunks, tokens, embedding, vectors e RAG, como eles se interligam e como todo o fluxo funciona. Logo depois um exemplo em Python totalmente local e funcional, utilizando a história de Naruto Uzumaki para explicar o RAG na prática."
pubDate: 2026-10-06
tags: ["IA Generativa", "Chunks", "Tokens", "Embeddings", "Vectors", "RAG", "LLM"]
series: "Fundamentos de IA Aplicada"
seriesOrder: 1
embed: /visuais/rag-passo-a-passo.html
---

## Mão na massa: a recuperação em Python

O código abaixo ilustra a lógica de recuperação com similaridade de cosseno. A função `embed` é um espaço reservado: troque pela chamada ao modelo de embeddings que você usa.

```python
"""
RAG simples com a história de Naruto.

Fluxo (o mesmo do guia):
  1. Indexação: cada trecho da história vira um vetor (embedding).
  2. Consulta:  a pergunta vira vetor e buscamos os trechos mais parecidos.
  3. Prompt:    montamos um prompt com esses trechos como contexto.
  4. Geração:   o LLM responde (passo final, fora deste arquivo).

Como rodar:
  pip install numpy sentence-transformers
  python naruto_rag.py
"""

import numpy as np
from sentence_transformers import SentenceTransformer

# Modelo de embeddings que entende português (gera vetores de 384 números)
modelo = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


# ------------------------------------------------------------
# Base de conhecimento: os "chunks" (pedaços de texto) da história
# ------------------------------------------------------------
CHUNKS = [
    "No dia em que Naruto Uzumaki nasceu, a Raposa de Nove Caudas, Kurama, atacou a vila de Konoha. "
    "O Quarto Hokage, Minato Namikaze, selou a fera dentro do recém-nascido e morreu na batalha.",

    "Por carregar a Raposa de Nove Caudas, Naruto cresceu sozinho e rejeitado pelos moradores de Konoha. "
    "Ele sonha em se tornar Hokage para ser reconhecido por todos.",

    "O Time 7 é formado por Naruto Uzumaki, Sasuke Uchiha e Sakura Haruno, "
    "treinados pelo professor Kakashi Hatake.",

    "Itachi Uchiha eliminou quase todo o clã Uchiha e poupou apenas o irmão mais novo, Sasuke. "
    "Desde então, Sasuke busca poder para se vingar.",

    "Sasuke Uchiha deixa Konoha em busca de poder e vai atrás de Orochimaru. "
    "Naruto promete trazê-lo de volta e os dois se enfrentam no Vale do Fim.",

    "Jiraiya, um dos Sannin lendários, treina Naruto por mais de dois anos. "
    "Ele ensina o Rasengan e a invocação de sapos.",

    "Sakura Haruno treina com Tsunade, a Quinta Hokage, "
    "e se torna uma ninja médica com uma força física enorme.",

    "Gaara, da Vila da Areia, carrega o Shukaku, o Tanuki de Uma Cauda. "
    "Depois de lutar contra Naruto, ele muda de caminho e se torna o Kazekage.",

    "A Akatsuki é uma organização criminosa que caça os jinchūriki, "
    "os ninjas que carregam bestas com cauda dentro de si, para extrair esses monstros.",

    "Na Quarta Grande Guerra Ninja, as vilas shinobi se unem em uma aliança "
    "para enfrentar Madara Uchiha e Obito. Naruto e Sasuke lutam lado a lado.",

    "Ao final da história, Naruto realiza seu sonho e se torna o Sétimo Hokage de Konoha.",
]


# ------------------------------------------------------------
# Funções do RAG
# ------------------------------------------------------------
def embed(texto: str) -> np.ndarray:
    """Transforma um texto em um vetor de números (embedding).

    Textos com sentido parecido geram vetores parecidos. Usamos o mesmo
    modelo para os chunks e para a pergunta, senão a comparação não funciona.
    """
    return modelo.encode(texto)


def cosseno(a: np.ndarray, b: np.ndarray) -> float:
    """Mede o quanto dois vetores se parecem (similaridade de cosseno).

    Retorna um valor entre -1 e 1. Quanto mais perto de 1, mais parecidos
    são os significados dos dois textos.
    """
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))


def indexar(chunks: list[str]) -> list[np.ndarray]:
    """Etapa de indexação: calcula o vetor de cada chunk, uma vez só.

    A lista devolvida fica na mesma ordem dos chunks. É a nossa
    "biblioteca de pergaminhos de Konoha", organizada por significado.
    """
    return [embed(texto) for texto in chunks]


def recuperar(pergunta: str, chunks: list[str], vetores: list[np.ndarray], k: int = 3) -> list[str]:
    """Etapa "Retrieval" do RAG: acha os k chunks mais parecidos com a pergunta.

    chunks:  os pedaços de texto da história
    vetores: o embedding de cada chunk, na mesma ordem
    k:       quantos trechos devolver
    """
    # Transforma a pergunta em vetor
    q = embed(pergunta)

    # Compara a pergunta com cada chunk e ordena do mais parecido para o menos parecido
    ranking = sorted(zip(chunks, vetores), key=lambda par: cosseno(q, par[1]), reverse=True)

    # Devolve só o texto dos k primeiros
    return [texto for texto, _ in ranking[:k]]


def montar_prompt(pergunta: str, trechos: list[str]) -> str:
    """Etapa "Augmented" do RAG: monta o prompt com o contexto encontrado.

    O LLM recebe as instruções, os trechos recuperados e a pergunta original.
    """
    # Junta os trechos em uma lista, um por linha
    contexto = "\n\n".join(f"- {t}" for t in trechos)

    return (
        # Instrução que obriga o modelo a responder só com base no contexto
        "Responda usando apenas o contexto abaixo. "
        "Se a resposta não estiver nele, diga que não sabe.\n\n"
        f"Contexto:\n{contexto}\n\nPergunta: {pergunta}"
    )


# ------------------------------------------------------------
# Programa principal
# ------------------------------------------------------------
if __name__ == "__main__":
    # 1) Indexação: acontece antes, uma vez só
    vetores = indexar(CHUNKS)

    # 2) Consulta: acontece a cada pergunta
    pergunta = "De quem Sasuke quer se vingar?"
    trechos = recuperar(pergunta, CHUNKS, vetores, k=3)

    print("Trechos encontrados:")
    for t in trechos:
        print(f"- {t}\n")

    # 3) Prompt: pergunta + contexto
    prompt = montar_prompt(pergunta, trechos)
    print("Prompt para o LLM:\n")
    print(prompt)

    # 4) Geração: envie `prompt` ao LLM de sua escolha e mostre a resposta.
    #    Exemplo: resposta = meu_llm(prompt)
```

## Armadilhas comuns

| Problema | Sintoma | Como mitigar |
| --- | --- | --- |
| Chunks grandes demais | Contexto com muito ruído | Reduzir o tamanho e usar sobreposição |
| Chunks pequenos demais | Trechos sem sentido isolados | Dividir por parágrafo ou seção |
| Recuperação fraca | Resposta fora do assunto | Busca híbrida (palavras-chave + vetores) e *reranking* |
| Modelo ignora o contexto | Resposta inventada | Instrução explícita no prompt e pedir citação das fontes |

## Resumo

- RAG separa **conhecimento** (base de documentos) de **raciocínio** (LLM).
- A qualidade da resposta depende mais da **recuperação** do que do modelo.
- Avaliar com perguntas reais e medir se os trechos certos foram recuperados é o que diferencia um protótipo de um sistema confiável.

**Próximo passo:** montar um pipeline completo com um banco vetorial e medir a qualidade com um conjunto de perguntas de teste.
