# Docker

### CMD vs ENTRYPOINT

##### 해당 컨테이너가 수행하게될 실행명령을 정의한 선언문이다.

#### CMD

- 컨테이너 실행 시 인자값을 주게되면 CMD에서 선언한 실행명령을 대체한다.
- `docker run + option` 실행 시 `CMD`의 명령어는 실행되지 않는다.

#### ENTRYPOINT

- 반드시 ENTRYPOINT에서 지정한 실행명령을 실행한다.
- `docker run + option` 실행 시 option 부분을 파라미터로 인식한다.
- 도커파일 내 1번만 정의 가능하다.

[참고자료] https://bluese05.tistory.com/77
j
