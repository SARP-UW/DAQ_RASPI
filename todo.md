# TODO
[ ] Create application layer code (spi stuff for ADC) -> not part of the "library"
[ ] Use typescript maybe + clean up code  (?)
[ ] Add website-side data saving
[ ] Add packets using JSON to clean up messages
[ ] Clean up server initialization code
[ ] Finish saving code
[ ] Make API
[ ] Clean up repo + finishing touches (?)

# API
class graph (name)
-> add source
-> remove source

class source (name, unit)
-> add data

# PACKET FORMAT

CONFIGURE IN COMMAND LINE 

## TODO keep track of graphs and sources and their linkages in the python

## Data
{"tag": "data", "test3": {"timestamps": ["1743395318.64724", "1743395318.330038", "1743395318.01572", "1743395317.703469", "1743395317.3880808", "1743395317.0719922"], "values": ["1", "1", "0", "5", "4", "8"]}}

## CREATE GRAPH

## DESTROY GRAPH

## CREATE SOURCE

## DESTROY SOURCE

## ADD SOURCE (graph)

## REMOVE SOURCE (graph)

