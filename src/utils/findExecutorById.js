export function findExecutor(executors, slpCode) {
  if (slpCode === null) return {};
  return (
    executors?.find(
      (executor) => Number(executor.SlpCode) === Number(slpCode)
    ) ?? {}
  );
}
