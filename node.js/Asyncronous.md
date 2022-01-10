# Asyncronous

##### 비동기 톺아보기. 그 특성을 고려하며 node.js를 사용하기 위하여

### 비동기 프로그래밍

1.  Event Loop는 요청을 처리하기위해 내부에서 약간의 thread와 프로세스를 사용한다. 이는 non-blocking IO 또는 내부 처리를 위한 목적으로 사용되고 요청 처리를 thread로 처리하지는 않음. 따라서 Multi-Thread 방식의 서버보다 thread와 오버헤드의 수가 훨씬 적다.

2.  Event Loop는 Single-Thread로 이루어져있으므로 CPU 소모가 큰 작업일 경우 전체 서버 성능에 영향을 줌.

[참고자료] https://www.nextree.co.kr/p7292/

### Event Loop

- 비동기 프로그래밍 단락의 1번에 대한 내용을 보면서 Event Loop 구조와 대해 정확한 처리 방식에 대해 호기심이 생겼다.

[참고자료] https://evan-moon.github.io/2019/08/01/nodejs-event-loop-workflow/
