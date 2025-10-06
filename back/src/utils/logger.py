import logging
import os


class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[94m', 'INFO': '\033[92m',
        'WARNING': '\033[93m', 'ERROR': '\033[91m',
        'CRITICAL': '\033[95m'
    }

    def format(self, record):
        log_fmt = f"{self.COLORS.get(record.levelname)}%(levelname)s:   \033[97m %(message)s"
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


class CustomLogger(ColoredFormatter):
    def __init__(self, loger_name: str, path: str, lvl: int = logging.DEBUG):
        super().__init__()
        self.path = path
        self.logger = logging.getLogger(name=loger_name)
        self.logger.setLevel(lvl)
        self.format = "%(levelname)-7s:   %(module)15s:%(lineno)-3d   %(asctime)s -> %(message)s"

        self.terminal_log = logging.StreamHandler()
        self.terminal_log.setLevel(lvl)
        self.terminal_log.setFormatter(ColoredFormatter())
        self.logger.addHandler(self.terminal_log)

        self.file_log = logging.FileHandler(filename=self.path)
        self.file_log.setLevel(lvl)
        self.file_log.setFormatter(logging.Formatter(self.format))
        self.logger.addHandler(self.file_log)


PATH = f"{os.path.dirname(os.path.abspath(__file__))}/../../.log"

CustomLogger(loger_name="auth_log", path=f"{PATH}/auth.log")
CustomLogger(loger_name="os_log", path=f"{PATH}/os.log")
CustomLogger(loger_name="anime_log", path=f"{PATH}/anime.log")

auth_log = logging.getLogger("auth_logger")
os_log = logging.getLogger("os_logger")
anime_log = logging.getLogger("anime_log")
