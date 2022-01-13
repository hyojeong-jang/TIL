# Asyncronous

##### 비동기 톺아보기. 그 특성을 고려하며 node.js를 사용하기 위하여

### 먼저 Node.js의 동작부터

1.  Event Loop는 요청을 처리하기위해 내부에서 약간의 thread와 프로세스를 사용한다. 이는 non-blocking IO 또는 내부 처리를 위한 목적으로 사용되고 요청 처리를 thread로 처리하지는 않음. 따라서 Multi-Thread 방식의 서버보다 thread와 오버헤드의 수가 훨씬 적다.

2.  Event Loop는 Single-Thread로 이루어져있으므로 CPU 소모가 큰 작업일 경우 전체 서버 성능에 영향을 줌.

### Event Loop

- '먼저 Node.js의 동작부터' 단락의 1번에 대한 내용을 보면서 Event Loop 구조와 대해 정확한 처리 방식에 대해 호기심이 생겼다.
- Event Loop는 자바스크립트 V8 엔진 내부에 존재하는 것이 아닌, 코드를 실행하기 위해 자바스크립트 V8 엔진을 사용함.
- Event Loop에는 작업을 담아놓는 스택은 존재하지 않음. 여러 개의 큐로 작업을 처리한다.
- Event Loop는 Timer, pending I/O callbacks, idle, prepare, poll, check, close callbacks 페이즈들로 구성되어있고, 이들은 각각의 큐를 가지고 있다.
- Timer phase: setTimeout이나 setTimeInterval과 같은 타이머의 콜백을 저장함. 비로 타이머의 콜백이 큐에 들어가는 것이 아닌 타이머들을 \*min-heap으로 유지하고 있다가, 실행할 때가 된 타이머의 콜백을 큐에 넣고 실행함.
- pending I/O callbacks phase: 이벤트루프의 pending queue에 들어와있는 콜백을 실행함. 이 큐의 콜백은 현재 돌고있는 루프 이전 작업에서 이미 들어와있었음. 예를 들어 TCP 핸들러 콜백 함수에서 파일 쓰기 작업을 했다면, TCP 통신이 끝나고 파일 쓰기도 끝난 후 파일쓰기의 콜백이 pending queue에 들어오게 됨. 또한 에러핸들러의 콜백도 pending queue로 들어옴.
- idle, prepare phase: idle은 매 tick마다, prepare은 매 polling마다 실행된다. Event Loop와 직접적인 관련은 없음.
- poll phase: 새로운 수신 커넥션과 데이터를 허용함. poll phase에 큐(watch queue)가 비어있지않으면 큐가 빌 때까지 동기적으로 모든 콜백을 실행함. 큐가 비어있다면 곧바로 다음 phase로 넘어가지않고 약간의 대기시간을 가짐.
- check phase: setImmediate 콜백 전용 phase
- close phase: close 타입의 핸들러를 처리하는 phase

### Event Loop 작업흐름

- `node example_script.js` 실행 시

1. Node.js는 이벤트 루프 생성 후 이벤트 루프 바깥에서 메인 모듈인 example_script.js을 실행한다.
2. 한 번 메인 모듈이 실행되고나면 Node.js는 이벤트루프가 활성상태인지 확인한다. (이벤트 루프에서 해야할 작업이 있는지 확인)
3. 이벤트 루프에 작업이 없다면 `process.on('exit, () => {})` 을 실행하여 이벤트 루프를 종료한다.
4. 이벤트 루프에 작업이 있다면 첫번째 Timer 페이즈를 실행한다.

### libuv

- Node.js에서 사용하는 비동기 I/O 라이브러리
- 윈도우나 리눅스의 커널을 추상화하여 래핑한 구조
- 즉 커널에서 지원하는 비동기 작업들을 알고있기 때문에 커널을 사용할 수 있는 작업을 발견하면 바로 커널로 넘김. 이후 이 작업들이 종료되어 커널로부터 시스템콜을 받으면 이벤트 루프에 콜백을 등록함.
- 커널이 지원하지 않는 작업일 경우 별도의 스레드에서 처리함.

#### 각주

- min-heap: 상위레벨 노드가 하위레벨 노드보다 작거나 같은 구조로 타이머가 실행되어야하는 순서대로 저장하기 좋은 자료구조

[참고자료] https://www.nextree.co.kr/p7292/
[참고자료] https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
