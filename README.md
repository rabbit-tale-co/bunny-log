# BunnyLog 🐇

BunnyLog is a simple and customizable (not yet!) logging utility for Node.js applications. It allows you to log messages with different categories and colors, making it easier to distinguish between various types of log messages.

## Features

- **Category-based Logging**: Log messages with different categories such as `server`, `database`, `error`, `info`, `success`, `warning`, `object` and `api`.
- **Color-coded Output**: Each category is associated with a specific color for easy identification.
- **JSON Object Logging**: Automatically formats and colorizes JSON objects for better readability.

## Installation

```bash
npm install bunnylog
```

## Usage

### Import BunnyLog
```Javascript
import { bunnyLog } from './bunnyLog';
```

### Logging Messages
```Javascript
bunnyLog.server( 'This is server message.')
bunnyLog.info('This is an informational message.');
bunnyLog.error('An error occurred:', new Error('Sample error'));
bunnyLog.success('Operation completed successfully.');
bunnyLog.warning('This is a warning message.');
bunnyLog.api('API request received');
bunnyLog.database('Database message.')
bunnyLog.object({ key: 'value', anotherKey: 42 });
```
### Example Outputs

*Server*

<img alt="Server Message" src="https://imgur.com/PqgEJdh.png">

*Info*

<img alt="Info Message" src="https://imgur.com/Kaq9EmM.png">

*Error*

<img alt="Error Message" src="https://imgur.com/LH6rGRO.png">

*Success*

<img alt="Success Message" src="https://imgur.com/46EtFRM.png">

*Warning*

<img alt="Warning Message" src="https://imgur.com/GyOrZiQ.png">

*Api*

<img alt="Api Message" src="https://imgur.com/fmaU33P.png">

*Database*

<img alt="Database Message" src="https://imgur.com/bKVPJGr.png">

*Object*

<img alt="Object Message" src="https://imgur.com/Sbom87j.png">

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
