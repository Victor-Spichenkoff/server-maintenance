# BUG SÉRIO:
- Está com defeito
  - 16/11 às 21:30 última discount -> 241,3h
  - 17/11 às 19:26 -> Desligou e ligou de novo só o this -> Não mudou nada
  - Iniciou e perdeu totalmente o discount antigo (voltou null), 1 dia inteiro perdido


# BUG FIX:
- Acho que ele não está sabendo lidar com lastDiscount como null
  - Usar o lastStart nesse caso pode servir


- Vou deixar ele rodando para testar se LastDiscount só muda quando realiza OFF/Shutdown mesmo
- Deveria ficar fixo (LastDiscount = X min atrás). Mas, ao desligar, deveria dar um discount final e limpar
- PRECISO: Não estou descontado ao chamar: updateUsageMiddleware, preciso corrigir isso depois


# TODO -> FIX MAINTENANCE TO ADD NEW
- Check telegrams, reports are terrible
  - 
- RUN MIGRATIONS PRISMA
  - TIMES: 202h 35m
  - I've run migrations, but it complains about unreacheble
- Did it can start and call or need a reset?
- Use prisma + ID in API entity (currentId)
- Frontend must be able to receive same response
- Backend must change the way

## Tests while changing from name (text) to id
- Continues to discount?
  - now: 18:43 ->
       - Main: 16h 7m
       - THIS: 17h 26m


# ADD NEW API
- types/data -> name
- functions/urls (url+name)


# .ENV
- NOT_SEND == mandar as mensagens? (true só em dev)
- NOT_REQ == Evita iniciar as requisições, usar em testes apenas
- DEV == ambiente é o de desenvolvimento?

# TODO REFACTOR
- Update month (remember to remember when change) 
- Send Usages on API start and start keep this on
- 



# Todo:
- Adicionar se aguenta até o fim do mês
-DB production não tá pegando os dados
- Ao mudar a API mantida, pelo menos em prod, ele não atualiza o status (na o resto atualiza)
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


# Funcionamento
- Todos as operações básicas de db são feitas no controller
  - Exceção: Aquelas mudanças que acontecem com ações mais internas, como descontos
