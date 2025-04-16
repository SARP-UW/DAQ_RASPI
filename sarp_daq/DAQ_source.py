from DAQ_graph import DAQGraph
from DAQ_logger import DAQLogger
from typing import Set


class DAQSource:
  '''TODO'''
  
  def __init__(self, name: str, unit: str) -> None:
    '''
    TODO
    '''
    self._name: str = name
    self._unit: str = unit
    self._logger_set: Set[DAQLogger] = set()
    self._graph_set: Set[DAQGraph] = set()



  def addData(self, value: float) -> None:
    '''
    TODO
    '''
    # cur_time: float = time()
    # self._file.write(f"{cur_time}, {value}\n") 
    ...

  
  def linkLogger(self, logger: DAQLogger) -> None:
    '''
    TODO
    '''
    self._logger_set.add(logger)

  
  def unlinkLogger(self, logger: DAQLogger) -> None:
    '''
    TODO
    '''


  def linkGraph(self, graph: Graph) -> None:
    ...

  def unlinkGraph(self, graph: Graph) -> None:
    ...
  