agent/connected
{
  agent: {
    uuid, // auto generar
    username, // definir por configuración
    name, // definir por configuración
    hostname, // obtener del sistema operativo
    pid // obtener del proceso
  }
}
agent/disconnected
{
  agent: {
    uuid
  }
}
agent/message
{
  agent,
  metrics: [
    {
      type,
      value
    }
  ],
  timestamp // generar cuando creamos el mensaje
}