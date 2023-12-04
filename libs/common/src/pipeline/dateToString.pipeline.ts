export const dateToString = [
  {
    $set: {
      day: { $dateToString: { format: '%d', date: '$createdAt' } },
      month: {
        $let: {
          vars: {
            monthsInString: [
              '',
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
          },
          in: { $arrayElemAt: ['$$monthsInString', { $month: '$createdAt' }] },
        },
      },
      year: { $dateToString: { format: '%Y', date: '$createdAt' } },
      time: { $dateToString: { format: '%H:%M:%S', date: '$createdAt' } },
    },
  },
  {
    $set: {
      createdAtString: {
        $concat: [
          { $toString: '$day' },
          ' ',
          '$month',
          ' ',
          { $toString: '$year' },
          ' ',
          '$time',
        ],
      },
    },
  },
  {
    $set: {
      dayUpdatedAt: { $dateToString: { format: '%d', date: '$updatedAt' } },
      monthUpdatedAt: {
        $let: {
          vars: {
            monthsInString: [
              '',
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
          },
          in: { $arrayElemAt: ['$$monthsInString', { $month: '$updatedAt' }] },
        },
      },
      yearUpdatedAt: { $dateToString: { format: '%Y', date: '$updatedAt' } },
      timeUpdatedAt: {
        $dateToString: { format: '%H:%M:%S', date: '$updatedAt' },
      },
    },
  },
  {
    $set: {
      updatedAtString: {
        $concat: [
          { $toString: '$dayUpdatedAt' },
          ' ',
          '$monthUpdatedAt',
          ' ',
          { $toString: '$yearUpdatedAt' },
          ' ',
          '$timeUpdatedAt',
        ],
      },
    },
  },
  {
    $unset: [
      'day',
      'month',
      'year',
      'dayUpdatedAt',
      'monthUpdatedAt',
      'yearUpdatedAt',
      'timeUpdatedAt',
      'time',
    ],
  },
];
