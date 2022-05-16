function solution11(record) {
  const nicknameMap = {};
  const result = [];
  const words = { Enter: "님이 들어왔습니다.", Leave: "님이 나갔습니다." };

  record.forEach((r) => {
    const [command, id, nickname] = r.split(" ");

    if (command !== "Leave") {
      nicknameMap[id] = nickname;
    }

    if (command !== "Change") {
      result.push([id, command]);
    }
  });

  return result.map(([id, command]) => {
    return `${nicknameMap[id]}${words[command]}`;
  });
}
