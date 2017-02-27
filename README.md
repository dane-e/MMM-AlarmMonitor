# MMM-AlarmMonitor
Notification API Module for MagicMirror<sup>2</sup>

## Example

Eigenes Modul zur Anzeige von Alarmierungen als Fullscreen-HTML-Seite und dazu in Liste eintragen.
Zusammengebaut aus den Modulen: alert und MMM-syslog.


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
