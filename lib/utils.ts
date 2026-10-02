import bcrypt from "bcryptjs"

export function hashPassword(password: string){
  const saltRound = 10
  const salt = bcrypt.genSaltSync(saltRound);
  const hash = bcrypt.hashSync(password, salt);

  return hash
}
export function stripAppSubdomain(host: string): string {
  // Remove port if present
  const [hostname, port] = host.split(':');

  // If hostname starts with "app.", remove it
  const stripped = hostname.startsWith('devgator.') || hostname.startsWith('dev.') || hostname.startsWith('codegator.') ? hostname.slice(10) : hostname;

  // Return the modified host (with port if present)
  return port ? `${stripped}:${port}` : stripped;
}

export function generateVerificationCode(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
export function formattedDate(){
  const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(today);
    return formattedDate;
}