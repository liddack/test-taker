# [Choice] Node.js version (use -bookworm, or -bullseye variants on local arm64/Apple Silicon): 20, 18, 20-bookworm, 18-bookworm, 20-bullseye, 18-bullseye, 20-buster, 18-buster
ARG VARIANT=20-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:1-${VARIANT}

# Install tslint, typescript. eslint is installed by javascript image
ARG NODE_MODULES="tslint-to-eslint-config typescript"
RUN su node -c "umask 0002 && npm install -g ${NODE_MODULES}" \
    && npm cache clean --force > /dev/null 2>&1

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends git

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

#[Optional] Uncomment if you want to install more global node packages
RUN su node -c "npm i -g @nestjs/cli"

USER node

# # Install pure zsh theme
# ENV home /home/node
RUN sed -i 's/ZSH_THEME=".*$/ZSH_THEME=""/g' "${HOME}/.zshrc"
RUN mkdir -p "${HOME}/.zsh"
RUN git clone https://github.com/sindresorhus/pure.git "${HOME}/.zsh/pure"
RUN echo 'fpath+=($HOME/.zsh/pure)' >> "${HOME}/.zshrc"
RUN echo 'autoload -U promptinit; promptinit' >> "${HOME}/.zshrc"
RUN echo 'prompt pure' >> "${HOME}/.zshrc"