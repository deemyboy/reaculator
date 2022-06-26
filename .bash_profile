alias ht="cd /c/xampp/htdocs"
alias rt="cd /c/xampp/htdocs/rentandride"
alias gs="git status"
alias ga="git add ."
alias gc="git commit"
alias gcm="git commit -m"
alias gm="git merge"
alias gp="git pull"
alias gb="git branch"
alias gbd="git branch -d"
alias gps="git push"
alias gco="git checkout"
alias gcb="git checkout -b"
alias com="git checkout master"
alias pa="php artisan"
alias pas="php artisan serve"
alias rd="cd /c/Users/user/learning/react"

test -f ~/.profile && . ~/.profile
test -f ~/.bashrc && . ~/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
