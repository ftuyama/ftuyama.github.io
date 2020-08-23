FROM node:12.18.3-alpine

LABEL com.github.actions.name="Run tests"
LABEL com.github.actions.description="Run npm eslint."
LABEL com.github.actions.icon="toggle-right"
LABEL com.github.actions.color="gray-dark"

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
