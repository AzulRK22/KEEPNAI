// pages/api/run-script.js

import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Cambia la ruta al script de Python según tu estructura de directorios
      const { stdout, stderr } = await execPromise('python3 /path/to/your/script.py');
      if (stderr) {
        return res.status(500).json({ error: stderr });
      }
      res.status(200).json({ result: stdout });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
