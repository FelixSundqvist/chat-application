function envGuard(cb: () => void) {
  if (!import.meta.env.DEV) {
    return;
  }
  cb();
}

const Logger = {
  log: (...args: unknown[]) => {
    envGuard(() => console.log(args));
  },
  error: (...args: unknown[]) => {
    envGuard(() => console.error(args));
  },
  warn: (...args: unknown[]) => {
    envGuard(() => console.warn(args));
  },
};

export default Logger;
