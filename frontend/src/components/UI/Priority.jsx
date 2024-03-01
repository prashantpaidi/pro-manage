import PropTypes from 'prop-types';

export default function Priority({ priority }) {
  let fillColor;
  switch (priority.toUpperCase()) {
    case 'HIGH PRIORITY':
      fillColor = '#FF2473';
      break;
    case 'MODERATE PRIORITY':
      fillColor = '#63C05B';
      break;
    case 'LOW PRIORITY':
      fillColor = '#18B0FF';
      break;
    default:
      fillColor = '#000000';
      break;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='9'
          height='9'
          viewBox='0 0 9 9'
          fill={fillColor}
        >
          <circle cx='4.5' cy='4.5' r='4.5' />
        </svg>
        &nbsp; &nbsp;
        {priority}
      </div>
    </>
    );
}

Priority.propTypes = {
  priority: PropTypes.string.isRequired,
};
