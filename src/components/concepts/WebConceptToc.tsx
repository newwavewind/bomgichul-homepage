export function WebConceptToc({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <nav aria-label="개념 바로가기" className="web-concept-toc">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
