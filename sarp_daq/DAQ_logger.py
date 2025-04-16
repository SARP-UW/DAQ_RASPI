from DAQ_source import DAQSource
from typing import List
from time import time_ns 

class DAQLogger:
  '''TODO'''

  def __init__(self, name: str, timestep: float, filepath: str, source_list: List[DAQSource]) -> None:
    '''
    TODO
    '''
    self._name: str = name
    self._filepath: str = filepath
    self._source_list: List[DAQSource] = source_list

    self._current_data: List[List[float]] = []
    self._prev_time: float = None
    self._enabled: bool = True
    self._file = open(filepath, "x")

    source_title_fn = lambda source: f"{source.name} ({source.unit}), "
    source_title_str = [source_title_fn(source) for source in source_list].join()
    self._file.write(f"time (ns), {source_title_str[:-2]}\n")


  def __del__(self) -> None:
    '''
    TODO
    '''
    if (self._prev_time is not None):
      self._write_cur_data()
    self._file.close()


  def _log_data(self, source: DAQSource, value: float) -> None:
    '''
    TODO
    '''
    if self._enabled and source in self._source_list:
      current_time: int = (time_ns() // self._timestep) * self._timestep
      source_index: int = self._source_list.index(source)

      if (current_time > self._prev_time and self._prev_time is not None):
        self._write_cur_data()
      self._prev_time = current_time
      self._current_data[source_index].append(value)


  def _write_cur_data(self) -> None:
    '''
    TODO'''
    new_col_str: str = f"{self._prev_time}, "
    for data_list in self._current_data:
      avg_value: float = sum(data_list) / len(data_list)
      new_col_str += f"{avg_value}, "
      data_list.clear()
    self._file.write(new_col_str[:-2] + "\n")


  @property
  def enabled(self) -> bool:
    '''TODO'''
    return self._enabled


  @enabled.setter
  def enabled(self, enabled: bool) -> None:
    '''TODO'''
    self._enabled = enabled