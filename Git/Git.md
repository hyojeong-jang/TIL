# Git

##### 어렵고 헷갈리는 깃 명령어

### 커밋의 작성자 변경하기

1. 작성자를 바꿀 커밋 선택
   `git rebase -i HEAD~3`
2. vi 편집기에서 변경할 커밋 앞에 붙은 단어 수정 "pick" -> "e" 후, 저장 종료 (:wq)
3. 변경할 작성자 입력
   `git commit --amend --author="hyozzang2 <janghyooao@gmail.com>"`
4. 리포지토리에 반영
   `git rebase --continue`
   `git push -f origin main`
