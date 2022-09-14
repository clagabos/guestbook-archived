import chalk from 'chalk';

function error(message, timestamp = true) {
    console.error(string(chalk.redBright(`${message}`), timestamp));
}

function info(message, timestamp = true) {
    console.info(string(chalk.greenBright(`${message}`), timestamp));
}

function warn(message, timestamp = true) {
    console.warn(string(chalk.yellowBright(`${message}`), timestamp));
}

function string(message, show_time) {
    return `${show_time ? chalk.gray(timestamp()) : ''}${message}`;
}

function timestamp() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let milliseconds = new Date().getMilliseconds();

    hours = `${hours}`.padStart(2, '0');
    minutes = `${minutes}`.padStart(2, '0');
    seconds = `${seconds}`.padStart(2, '0');
    milliseconds = `${milliseconds}`.padStart(3, '0');
    
    return `${hours}:${minutes}:${seconds}-${milliseconds} `;
}

export default {
    info,
    error,
    warn
}