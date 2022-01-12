# Asyncronous

##### 비동기 톺아보기. 그 특성을 고려하며 node.js를 사용하기 위하여

### 먼저 Node.js의 동작부터

1.  Event Loop는 요청을 처리하기위해 내부에서 약간의 thread와 프로세스를 사용한다. 이는 non-blocking IO 또는 내부 처리를 위한 목적으로 사용되고 요청 처리를 thread로 처리하지는 않음. 따라서 Multi-Thread 방식의 서버보다 thread와 오버헤드의 수가 훨씬 적다.

2.  Event Loop는 Single-Thread로 이루어져있으므로 CPU 소모가 큰 작업일 경우 전체 서버 성능에 영향을 줌.

[참고자료] https://www.nextree.co.kr/p7292/

### Event Loop

- '먼저 Node.js의 동작부터' 단락의 1번에 대한 내용을 보면서 Event Loop 구조와 대해 정확한 처리 방식에 대해 호기심이 생겼다.
- Event Loop는 자바스크립트 V8 엔진 내부에 존재하는 것이 아닌, 코드를 실행하기 위해 자바스크립트 V8 엔진을 사용함.
- Event Loop에는 작업을 담아놓는 스택은 존재하지 않음. 여러 개의 큐로 작업을 처리한다.
- Event Loop는 Timer, pending I/O callbacks, idle, prepare, poll, check, close callbacks 페이즈들로 구성되어있고, 이들은 각각의 큐를 가지고 있다.
- Timer phase: setTimeout이나 setTimeInterval과 같은 타이머의 콜백을 저장함. 비로 타이머의 콜백이 큐에 들어가는 것이 아닌 타이머들을 \*min-heap으로 유지하고 있다가, 실행할 때가 된 타이머의 콜백을 큐에 넣고 실행함.
- pending I/O callbacks phase: 이벤트루프의 pending queue에 들어와있는 콜백을 실행함. 이 큐의 콜백은 현재 돌고있는 루프 이전 작업에서 이미 들어와있었음. 예를 들어 TCP 핸들러 콜백 함수에서 파일 쓰기 작업을 했다면, TCP 통신이 끝나고 파일 쓰기도 끝난 후 파일쓰기의 콜백이 pending queue에 들어오게 됨. 또한 에러핸들러의 콜백도 pending queue로 들어옴.

#### 각주

- min-heap: 상위레벨 노드가 하위레벨 노드보다 작거나 같은 구조로 타이머가 실행되어야하는 순서대로 저장하기 좋은 자료구조

[참고자료] https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
