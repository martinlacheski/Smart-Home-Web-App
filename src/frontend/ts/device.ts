type TypeDevice =
  [{ id: 1, 'description': 'Luces ON/OFF' }, { id: 2, 'description': 'Luces dimerizables' },
    { id: 3, 'description': 'Persianas (Apertura variable)' }, { id: 4, 'description': 'Enchufes ON/OFF' },
    { id: 5, 'description': 'Ventiladores (Apertura variable)' }, { id: 6, 'description': 'Aire acondicionado (Temperatura variable)' }]


/*
---Type of DEVICES---
1 = Luces ON/OFF
2 = Luces dimerizables
3 = Persianas (Apertura variable)
4 = Enchufes ON/OFF
5 = Ventiladores (Apertura variable)
6 = Aire acondicionado (temperatura variable)
*/

class Device {
  public id: number;
  public name: string;
  public description: string;
  public state: number;
  public type: number;
}
