# Load Balancer (ALB) - Notas

- **Sub-redes publicas**: duas ou mais em zonas distintas. Associar security group permitindo 80/443 do publico.
- **Listeners**:
  - `HTTP :80` -> redirecionar para HTTPS se houver certificado.
  - `HTTPS :443` -> usar certificado ACM. Regras:
    - `/api/*` ou rota dedicada -> target group do backend (porta 8000).
    - `/` e rotas estaticas -> target group do frontend (porta 80).
- **Target groups**:
  - Tipo `IP` (Fargate), protocolo HTTP, health check `/health` para backend e `/` para frontend.
  - `Matcher` 200-399 para evitar flaps.
- **Seguranca**:
  - SG do ALB abre 80/443; SG das tasks permite apenas trafego vindo do SG do ALB.
  - Sub-redes privadas das tasks com rota para NAT (para baixar atualizacoes e logs).
- **Observabilidade**:
  - Habilitar access logs do ALB em bucket S3.
  - Monitorar metricas de 5xx/latencia; configurar alarms CloudWatch e, se necessario, auto scaling para ECS.
