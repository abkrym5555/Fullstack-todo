export default function Toast({ message, type }) {
  const isError = type === 'error';
  return (
    <div className={fixed bottom-8 right-8 bg-surface border rounded-xl py-3 px-5 text-sm z-50 shadow-lg ${isError ? 'border-danger text-danger' : 'border-success text-success'}}>
      {message}
    </div>
  );
}
