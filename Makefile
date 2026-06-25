# DB
CONTAINER:=maintenance-postgres
DB:=maintenance_dev
USER:=maintenance_user
PASSWORD?=12345
# DADOS sobre backup
# Imutável. Apenas se modificar diretamente FULL_PATH
override BACKUP_DIR = ./db_dumps
# Sempre sem o .sql
FILE_NAME ?= backup
FULL_PATH = ${BACKUP_DIR}/${FILE_NAME}.sql

# Cores (apenas estilo)
GREEN=\033[0;32m
BLUE=\033[0;34m
RED=\033[0;31m
# NoColor (Volta ao padrão)
NC=\033[0m


# Garante criação do diretório base
$(BACKUP_DIR):
	@mkdir -p $(BACKUP_DIR)
	@echo "$(BLUE)Criado diretório $(BACKUP_DIR)$(NC)"

# Dump completo. Irá limpar banco e adicionar novamente todos os dados e estrutura
# Permite voltar entre diferentes migrations rapidamente
dump: $(BACKUP_DIR)
	@if [ -f "$(FULL_PATH)" ]; then \
		echo "$(RED)Erro: arquivo já existe: $(FULL_PATH)$(NC)"; \
        echo "$(RED)Use 'make dump-force' ou use outro nome$(NC)"; \
		exit 1; \
	fi
	@PGPASSWORD=$(PASSWORD) docker exec -i $(CONTAINER) \
	pg_dump -U $(USER) -d $(DB) --clean --if-exists \
	--encoding=UTF8 \
	--inserts > "$(FULL_PATH)"
	@echo "$(GREEN)Backup criado em $(FULL_PATH)$(NC)"


# Sobrescreve mesmo existindo
dump-force: $(BACKUP_DIR)
	@if [ -f "$(FULL_PATH)" ]; then \
		echo "$(BLUE)Arquivo em $(FULL_PATH) foi sobrescrito$(NC)"; \
	fi
	@PGPASSWORD=$(PASSWORD) docker exec -i $(CONTAINER) \
	pg_dump -U $(USER) -d $(DB) --clean --if-exists \
	--encoding=UTF8 \
	--inserts > "$(FULL_PATH)"
	@echo "$(GREEN)Backup criado em $(FULL_PATH)$(NC)"


# Garante nome único usando data e hora atual
dump-unique: $(BACKUP_DIR)
	@FILE="$(BACKUP_DIR)/backup_$$(date +%Y-%m-%d_%H-%M-%S).sql"; \
	PGPASSWORD=$(PASSWORD) docker exec -i $(CONTAINER) \
	pg_dump -U $(USER) -d $(DB) --clean --if-exists --inserts --encoding=UTF8 > "$$FILE"; \
	echo "$(GREEN)Backup criado em $$FILE$(NC)"


# Restaurar dump
# Em caso de erro, ele para automaticamente e não imprime a mensagem
restore:
	@PGPASSWORD=$(PASSWORD) docker exec -i $(CONTAINER) \
	psql -v ON_ERROR_STOP=1 -U $(USER) -d $(DB) <  "$(FULL_PATH)" && \
    echo "$(GREEN)Restaurado de $(FULL_PATH)$(NC)"


# Listar todos no diretório padrão
list: $(BACKUP_DIR)
	@ls -lhtr $(BACKUP_DIR)/*.sql 2>/dev/null || echo "$(BLUE)Nenhum dump encontrado$(NC)"


# Abrir console do Postgres no terminal
psql:
	@PGPASSWORD=$(PASSWORD) docker exec -it $(CONTAINER) \
	psql -U $(USER) -d $(DB)


help:
	@echo ""
	@echo "$(BLUE)Comandos disponíveis:$(NC)"
	@echo ""
	@echo "  $(GREEN)make dump$(NC)         - Cria backup (falha se já existir)"
	@echo "  $(GREEN)make dump-force$(NC)   - Sobrescreve backup existente"
	@echo "  $(GREEN)make dump-unique$(NC)  - Cria backup com timestamp único"
	@echo "  $(GREEN)make restore$(NC)      - Restaura o banco a partir do backup"
	@echo "  $(GREEN)make list$(NC)         - Lista todos os dumps"
	@echo "  $(GREEN)make psql$(NC)         - Abre console do Postgres"
	@echo ""
	@echo "$(BLUE)Variáveis:$(NC)"
	@echo ""
	@echo "  FILE_NAME=nome_do_arquivo (sem .sql)"
	@echo ""
	@echo "$(BLUE)Exemplos:$(NC)"
	@echo ""
	@echo "  make dump FILE_NAME=antes_teste"
	@echo "  make restore FILE_NAME=antes_teste"
	@echo ""

