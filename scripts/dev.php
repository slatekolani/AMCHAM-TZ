<?php

$commands = [
    'Laravel' => ['php', 'artisan', 'serve', '--host=127.0.0.1', '--port=8000'],
    'Vite' => ['npm', 'run', 'dev'],
];

$processes = [];
$descriptors = [
    0 => STDIN,
    1 => STDOUT,
    2 => STDERR,
];

function stopProcesses(array &$processes): void
{
    foreach ($processes as $name => $process) {
        $status = proc_get_status($process);

        if ($status['running']) {
            fwrite(STDOUT, PHP_EOL."Stopping {$name}...".PHP_EOL);
            proc_terminate($process);
        }

        proc_close($process);
    }

    $processes = [];
}

if (function_exists('pcntl_async_signals')) {
    pcntl_async_signals(true);
    pcntl_signal(SIGINT, function () use (&$processes) {
        stopProcesses($processes);
        exit(0);
    });
    pcntl_signal(SIGTERM, function () use (&$processes) {
        stopProcesses($processes);
        exit(0);
    });
}

foreach ($commands as $name => $command) {
    fwrite(STDOUT, "Starting {$name}: ".implode(' ', $command).PHP_EOL);

    $process = proc_open($command, $descriptors, $pipes, getcwd());

    if (! is_resource($process)) {
        stopProcesses($processes);
        fwrite(STDERR, "Unable to start {$name}.".PHP_EOL);
        exit(1);
    }

    $processes[$name] = $process;
}

fwrite(STDOUT, PHP_EOL.'Laravel app: http://127.0.0.1:8000'.PHP_EOL);
fwrite(STDOUT, 'Vite dev server: see the Vite output below for the HMR URL.'.PHP_EOL);
fwrite(STDOUT, 'Press Ctrl+C to stop both servers.'.PHP_EOL.PHP_EOL);

while ($processes !== []) {
    foreach ($processes as $name => $process) {
        $status = proc_get_status($process);

        if (! $status['running']) {
            $exitCode = proc_close($process);
            unset($processes[$name]);

            stopProcesses($processes);
            fwrite(STDERR, "{$name} stopped with exit code {$exitCode}.".PHP_EOL);
            exit($exitCode === 0 ? 0 : $exitCode);
        }
    }

    usleep(250000);
}
