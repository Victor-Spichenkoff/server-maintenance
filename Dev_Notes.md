# .ENV
- NOT_SEND == mandar as mensagens? (true só em dev)
- NOT_REQ == Evita iniciar as requições, usar em testes apenas
- DEV == ambiente é o de desenvolvimento?

# Todo:

- Adicionar e testar melhorar no sistema de manter o this on
- Ver se qunado manda "Desligando servidor", se refere apenas as outra, ou tmabém ao this (off: true)
- Adicionar se aguenta até o fim do mês
-DB production não tá pegando os dados
- Ao mudar a API mantida , pelo menos em prod, ele não atualiza o status (na o resto atualiza)
- valores maiores que 597 horas, não são salvos



# DB:
## Prod:
- neon: 
- dev: postgresql://postgres:pituca@localhost:5432/dev-maintenance?schema=public


# Mudanças para vercel
## Tirar o request para o this
- schedule: remover o StartKeepApiOnMode
- Tirei os callThis de operations e não usa mais o StartKeepApiOnMode
- discountFromMainAccountTime adicionado diretamente no selectTimer()
    - Salvo, também, o lastDiscount dentro de discountFromMainAccountTime


## Bug:
- Para lidar com usage maior que 597, precisa usar Bigint no usage. Converti para Number, pode perder precisão