import { isTodo, TODO_PREFIX } from "../data/content";

// 문자열이 "TODO(확인 필요)"로 시작하면 점선 배지로 보여 주고, 아니면 그대로 출력한다.
// 확인되지 않은 내용이 사실처럼 보이지 않게 하려는 장치다.
export default function TodoText({ text }: { text: string }) {
  if (!isTodo(text)) return <>{text}</>;
  const detail = text.slice(TODO_PREFIX.length).trim();
  return (
    <span className="todo">
      <span className="todoTag">TODO</span>
      {detail || "확인 필요"}
    </span>
  );
}
