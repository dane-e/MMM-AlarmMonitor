# MMM-AlarmMonitor
Notification API Module for MagicMirror<sup>2</sup>

## Example

Eigenes Modul zur Anzeige von Alarmierungen als Fullscreen-HTML-Seite und dazu in Liste eintragen.
Zusammengebaut aus den Modulen: [alert](https://github.com/MichMich/MagicMirror/tree/develop/modules/default/alert) und [MMM-syslog](https://github.com/paviro/MMM-syslog).

![](https://github.com/dane-e/MMM-AlarmMonitor/blob/master/example.png)

## Dependencies
  * An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)

## Installation
 1. Clone this repo into `~/MagicMirror/modules` directory.
 2. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-AlarmMonitor',
        position: 'top_right',
        config: {
            ...
        }
    }
    ```

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `title` | `Alarms` | Header of the list. |
| `max` | `5` | How many messages should be displayed in the list. |
| `format` | `false` | Displays relative date format, for absolute date format provide a string like `'DD:MM HH:mm'` [All Options](http://momentjs.com/docs/#/displaying/format/) |
| `types` | `{INFO: "dimmed", WARNING: "normal", ERROR: "bright"}` | Object with message types and their css class. |
| `shortenMessage` | `false` | After how many characters the message should be cut. Default: show all. |
| `googleApi` | `` | If GoogleMaps Javascript Api is used, insert here your API key. |
| `activate_monitor` | `false` | Sends notification to MMM-PIR module to activate monitor. Sends USER_PRESENCE = true if alert is received. |
| `display_time` | `5000` | Time in microseconds, how long alert notification is shown. |
| `displayAlert` | `300000` | Time in microseconds, how long alert is shown in fullscreen. |


## How to Use
Make an http get request like:
  http://MIRROR_IP:MIRROR_PORT/AlarmMonitor?type=INFO&message=YOUR_MESSAGE

## Open Source Licenses
###[NotificationStyles](https://github.com/codrops/NotificationStyles)
See [ympanus.net](http://tympanus.net/codrops/licensing/) for license.

###The MIT License (MIT)

Copyright © 2017 dane-e

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**

