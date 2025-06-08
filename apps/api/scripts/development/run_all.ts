import concurrently from 'concurrently';

const availableServices = [
  {
    name: 'auth',
    title: 'Auth-Service',
    color: 'magenta',
  },
  {
    name: 'employee',
    title: 'Employee-Service',
    color: 'cyan',
  },
  {
    name: 'history',
    title: 'History-Service',
    color: 'yellow',
  },
  {
    name: 'notification',
    title: 'Notification-Service',
    color: 'white',
  },
];

const { result } = concurrently(
  [
    {
      command: 'pnpm start:dev gateway',
      name: 'API Gateway',
      prefixColor: 'blue',
    },
    ...availableServices.map((service) => {
      return {
        command: `pnpm start:dev ${service.name}`,
        name: service.title,
        prefixColor: service.color || 'green',
      };
    }),
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
  },
);

result.then(
  () => {
    console.log('All processes completed successfully.');
  },
  (err) => {
    console.error('One of the processes failed:', err);
  },
);
