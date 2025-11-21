# Atenção, armazenei o index do ano, não o número mesmo (-1 do mês atual)

- Ao ativar um especifico, resetar o inicio e descontar do tempo da 2° conta
- Descontar de ambos
- Se tiver no modo all, mutiplicar pela quantidade mantida ON 



- pegar o atual
- salvar o inicio
- sempre que mudar o modo, realizar o desconto e atualizar para o novo inicio
- Vou guardar **O número total e o usado**, lembrar de multiplicar no caso de multiplos


# to-do
- usar o alreadyStartedThis para garantir melhor economia de recuros
    - Se usar o alreadyStartedThis, ele cuida de tudo, os offs, devem setar para false


# TEste a fazer 



# Estrutura:
  "keepThisApiOn": false,
  "usageMainAccount": minutos,
  "usageThisAccount": minutos,
  "lastStart": null timestamp


# Workflow 
- Quero inciar -> salvar o inicio e iniciar modo recursivo
- A cada chamda, descontar
- Se mudar para deixar algum ativo (além da api), descontar e usar os 2 juntos