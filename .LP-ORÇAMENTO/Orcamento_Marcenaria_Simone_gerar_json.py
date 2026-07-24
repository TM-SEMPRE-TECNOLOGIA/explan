"""
Gera JSON no formato Zustand persist para injetar no Explan V3 via console F12.
Uso: python3 orcamento_simone_gerar_json.py
Copia o output e cola no console do navegador (F12).
"""
import json, math

# Dados extraídos da planilha — agrupados por ambiente
# Formato: { "ambiente": [ { "mobiliario": ..., "area": ..., "valor_unit": ..., "valor_total": ..., "detalhamento": ... }, ... ] }
AMBIENTES = {
    "Gourmet / Área Social": [
        {
            "mobiliario": "Armário inferior da bancada",
            "area": 2.52,
            "valor_unit": 2000,
            "valor_total": 5040,
            "detalhamento": "MDF Carvalho Malva - Duratex; interior Branco TX; 3 gavetas e 5 portas; puxador cava; base revestida no mesmo vinílico do piso; prateleira superior em MDF Palha Trama."
        },
        {
            "mobiliario": "Cristaleira",
            "area": 4.07,
            "valor_unit": 2000,
            "valor_total": 8140,
            "detalhamento": "MDF Carvalho Malva - Duratex; portas superiores em vidro canelado; puxador linear slim escovado; gavetas, portas inferiores e prateleiras internas."
        },
        {
            "mobiliario": "Painéis decorativos",
            "area": 15.24,
            "valor_unit": 2000,
            "valor_total": 30480,
            "detalhamento": "Painéis em MDF Carvalho Malva - Duratex, incluindo revestimentos das paredes e integração com portas; conferir recortes e vãos no local."
        }
    ],
    "Sala": [
        {
            "mobiliario": "Painel/portal com porta integrada",
            "area": 12.57,
            "valor_unit": 2000,
            "valor_total": 25140,
            "detalhamento": "MDF Carvalho Malva - Duratex; revestimento piso-teto; frisos de 1 cm; porta de correr da cozinha por trás do painel; valor calculado pela área líquida aproximada, descontando os vãos."
        },
        {
            "mobiliario": "Porta de correr e portal revestido",
            "area": 2.27,
            "valor_unit": 2000,
            "valor_total": 4540,
            "detalhamento": "Porta de correr revestida em MDF Carvalho Malva - Duratex; trilho embutido na sanca; portal com vão interno revestido."
        }
    ],
    "Cozinha": [
        {
            "mobiliario": "Armário inferior - bancada 2,00 m",
            "area": 1.5,
            "valor_unit": 2000,
            "valor_total": 3000,
            "detalhamento": "MDF Carvalho Malva - Duratex; interior Branco TX; 4 portas; puxador cava; prateleiras móveis; base revestida no vinílico do piso."
        },
        {
            "mobiliario": "Conjunto de armários - bancada 3,01 m",
            "area": 4.82,
            "valor_unit": 2000,
            "valor_total": 9640,
            "detalhamento": "Armários inferiores em MDF Carvalho Malva e superiores em MDF Palha Trama - Duratex; gavetas, portas, porta-temperos; LED inferior; puxadores cava/passante."
        },
        {
            "mobiliario": "Torre quente",
            "area": 4.22,
            "valor_unit": 2000,
            "valor_total": 8440,
            "detalhamento": "MDF Carvalho Malva e MDF Palha Trama - Duratex; nichos para forno e micro-ondas; portas superiores; gaveta inferior; detalhes com ressalto em MDF 6 mm."
        },
        {
            "mobiliario": "Mesa de apoio",
            "area": 1.22,
            "valor_unit": 2000,
            "valor_total": 2440,
            "detalhamento": "Mesa em MDF Carvalho Malva - Duratex; tampo suspenso; canto curvo; fixação integrada à torre quente."
        }
    ],
    "Lavabo": [
        {
            "mobiliario": "Tampo e prateleira",
            "area": 0.4,
            "valor_unit": 2000,
            "valor_total": 800,
            "detalhamento": "Tampo e prateleira em MDF Carvalho Malva - Duratex; frente fixa; suporte/estrutura oculta."
        },
        {
            "mobiliario": "Base do espelho",
            "area": 1.0,
            "valor_unit": 2000,
            "valor_total": 2000,
            "detalhamento": "Base em MDF Carvalho Malva - Duratex para espelho redondo; espelho e instalação conforme detalhamento."
        }
    ],
    "Lavanderia": [
        {
            "mobiliario": "Armário principal",
            "area": 2.07,
            "valor_unit": 2000,
            "valor_total": 4140,
            "detalhamento": "MDF Carvalho Malva - Duratex; portas com puxador cava; nichos e prateleiras; espaço técnico para equipamentos; base revestida."
        },
        {
            "mobiliario": "Armário alto / vassoureiro",
            "area": 1.46,
            "valor_unit": 2000,
            "valor_total": 2920,
            "detalhamento": "MDF Carvalho Malva - Duratex; vassoureiro; prateleiras internas; porta com puxador cava vertical."
        }
    ],
    "Despensa": [
        {
            "mobiliario": "Conjunto de prateleiras",
            "area": 5.31,
            "valor_unit": 2000,
            "valor_total": 10620,
            "detalhamento": "Prateleiras reforçadas em MDF Palha Trama - Duratex; apoiadas no chão; pés/apoios em serralheria conforme projeto."
        }
    ],
    "Escritório": [
        {
            "mobiliario": "Mesa, painel e prateleiras",
            "area": 2.9,
            "valor_unit": 2000,
            "valor_total": 5800,
            "detalhamento": "Mesa, painel e prateleiras em MDF Carvalho Malva - Duratex; armários estreitos para passagem de cabos; passa-fios; portas e prateleiras internas."
        },
        {
            "mobiliario": "Armário alto",
            "area": 1.29,
            "valor_unit": 2000,
            "valor_total": 2580,
            "detalhamento": "MDF Palha Trama - Duratex; porta com puxador no próprio MDF; prateleiras internas; interior Branco TX; base revestida."
        }
    ],
    "Corredor": [
        {
            "mobiliario": "Armário alto para apoio/limpeza",
            "area": 3.34,
            "valor_unit": 2000,
            "valor_total": 6680,
            "detalhamento": "MDF Palha Trama - Duratex; prateleiras, vão para aspirador/robô aspirador; portas com moldura e puxador cava; interior Branco TX."
        },
        {
            "mobiliario": "Armário, mesa e painel",
            "area": 2.77,
            "valor_unit": 2000,
            "valor_total": 5540,
            "detalhamento": "MDF Carvalho Malva e MDF Palha Trama - Duratex; armário alto, mesa com gavetas e tomada embutida, painéis, cava e fitas de LED."
        },
        {
            "mobiliario": "Painel com espelho",
            "area": 0.95,
            "valor_unit": 2000,
            "valor_total": 1900,
            "detalhamento": "Base em MDF Carvalho Malva - Duratex com borda ressaltada; espelho prata lapidado colado."
        }
    ],
    "Suíte dos Filhos": [
        {
            "mobiliario": "Cama com bicama/gavetões",
            "area": 2.4,
            "valor_unit": 2000,
            "valor_total": 4800,
            "detalhamento": "MDF Carvalho Malva e MDF Palha Trama - Duratex; bicama, gavetões, escada de acesso e molduras em MDF 6 mm."
        },
        {
            "mobiliario": "Armário",
            "area": 4.53,
            "valor_unit": 2000,
            "valor_total": 9060,
            "detalhamento": "MDF Palha Trama - Duratex; 4 portas; maleiros; cabideiros; gavetas; sapateira com corrediça; interior Branco TX; puxador cava."
        }
    ],
    "Banheiro dos Filhos": [
        {
            "mobiliario": "Tampo e prateleira",
            "area": 0.21,
            "valor_unit": 2000,
            "valor_total": 420,
            "detalhamento": "MDF Carvalho Malva - Duratex; tampo, prateleira e frente fixa para bancada."
        }
    ],
    "Suíte da Filha": [
        {
            "mobiliario": "Cama com bicama",
            "area": 2.45,
            "valor_unit": 2000,
            "valor_total": 4900,
            "detalhamento": "MDF Carvalho Malva - Duratex; bicama; tampa removível para armazenamento; moldura para colchão auxiliar; puxador cava."
        },
        {
            "mobiliario": "Painel/cabeceira",
            "area": 2.87,
            "valor_unit": 2000,
            "valor_total": 5740,
            "detalhamento": "MDF Carvalho Malva e MDF Palha Trama - Duratex; palhinha indiana; moldura com ressalto; fita de LED atrás do painel."
        },
        {
            "mobiliario": "Armário",
            "area": 3.68,
            "valor_unit": 2000,
            "valor_total": 7360,
            "detalhamento": "MDF Palha Trama - Duratex; 3 portas com palhinha indiana; moldura de 3 cm; maleiros, prateleiras, gavetas, sapateiras e cabideiro."
        }
    ],
    "Banheiro da Filha": [
        {
            "mobiliario": "Tampo, prateleira e painel de espelho",
            "area": 0.87,
            "valor_unit": 2000,
            "valor_total": 1740,
            "detalhamento": "MDF Carvalho Malva - Duratex; tampo, prateleiras, porta com ressalto; espelho prata lapidado colado no MDF."
        }
    ],
    "Suíte Master": [
        {
            "mobiliario": "Painel/cabeceira",
            "area": 7.77,
            "valor_unit": 2000,
            "valor_total": 15540,
            "detalhamento": "MDF Carvalho Malva - Duratex; cabeceira com palhinha indiana, muxarabi e fitas de LED; área líquida aproximada com desconto do vão da porta."
        },
        {
            "mobiliario": "Penteadeira suspensa",
            "area": 1.1,
            "valor_unit": 2000,
            "valor_total": 2200,
            "detalhamento": "MDF Carvalho Malva - Duratex; 4 gavetas com puxador cava arredondado; canto curvo; fixação suspensa na parede."
        }
    ],
    "Suíte Master / Closet": [
        {
            "mobiliario": "Portas de correr do closet",
            "area": 5.94,
            "valor_unit": 2000,
            "valor_total": 11880,
            "detalhamento": "2 portas de correr; lado do quarto revestido com o mesmo papel de parede e lado do closet com espelho prata lapidado colado no MDF; laterais fixas."
        }
    ],
    "Closet Master": [
        {
            "mobiliario": "Armário 1",
            "area": 6.27,
            "valor_unit": 2000,
            "valor_total": 12540,
            "detalhamento": "MDF Palha Trama - Duratex; 4 portas; maleiros; cabideiros; gavetas; sapateiras com corrediça; cofre e tábua de passar embutida."
        },
        {
            "mobiliario": "Armário 2",
            "area": 3.54,
            "valor_unit": 2000,
            "valor_total": 7080,
            "detalhamento": "MDF Palha Trama - Duratex; 3 portas; maleiros; cabideiros; gavetas e sapateiras com corrediça; puxador cava vertical."
        }
    ],
    "Banheiro Master": [
        {
            "mobiliario": "Armário da bancada",
            "area": 1.01,
            "valor_unit": 2000,
            "valor_total": 2020,
            "detalhamento": "MDF Carvalho Malva - Duratex; 4 portas e 4 gavetas; moldura de 1 cm; puxadores cava; prateleira interna e fechamento frontal fixo."
        }
    ]
}

def converter_para_json_f12():
    ambientes = []
    for nome_amb, itens in AMBIENTES.items():
        env = {
            "id": "env-" + str(hash(nome_amb))[1:13],
            "nome": nome_amb,
            "itens": [],
            "total": 0,
            "desconto_pct": 0,
            "materiais": {"chapa": "18", "ferragem": "blum", "cor": "cor"}
        }
        for it in itens:
            item = {
                "nome": it["mobiliario"],
                "unidade": "m²",
                "preco": it["valor_unit"],
                "qtd": round(it["area"], 2),
                "subtotal": it["valor_total"],
                "descricao": it["detalhamento"]
            }
            env["itens"].append(item)
            env["total"] += it["valor_total"]
        ambientes.append(env)

    total_geral = sum(a["total"] for a in ambientes)

    payload = {
        "state": {
            "cliente": {
                "nome": "Simone Pereira de Carvalho Nunes",
                "whatsapp": "",
                "email": "",
                "cpf": "",
                "pagamento": "50% assinatura + 50% conclusão",
                "prazo": "60 dias corridos",
                "instalacao": "7 dias",
                "endereco": "",
                "observacoes": "",
                "responsavelNome": "",
                "responsavelCpf": ""
            },
            "ambientes": ambientes,
            "variaveis": {
                "frete": 0,
                "comissaoVendedor": 0,
                "comissaoArquiteto": 0,
                "acrescimos": 0
            },
            "projetosSalvos": []
        },
        "version": 0
    }

    js_code = f"""// =============================================
// COLE ISSO NO CONSOLE DO NAVEGADOR (F12)
// Depois recarregue a página (F5)
// =============================================
localStorage.setItem('explan-v3-orcamento', JSON.stringify({json.dumps(payload, ensure_ascii=False, indent=2)}));
console.log('✅ Orçamento Simone carregado! Dê F5 para ver.');
location.reload();
"""
    return js_code, total_geral


if __name__ == "__main__":
    js, total = converter_para_json_f12()
    print(f"// Total geral: R$ {total:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
    print(f"// Ambientes: {len(AMBIENTES)}")
    print(f"// Total de itens: {sum(len(v) for v in AMBIENTES.values())}")
    print()
    print(js)
