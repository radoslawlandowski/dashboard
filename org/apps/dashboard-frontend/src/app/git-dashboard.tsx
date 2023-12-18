// eslint-disable-next-line @typescript-eslint/no-unused-vars

export function GitDashboard({localChangesOn, fetchPushed, errorOn, isDevelop, isMaster, isFeatureBranch}: any) {
  const DigitalRead = ({isOn, label, color}: any) => {
    const style = {
      backgroundColor: isOn ? color : "grey",
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      "text-align": "center"
  }

    return (
      <div>
        <div>
          <p>{label}</p>
        </div>
        <div style={style}></div>
      </div>
    );
  };

  const row = {
    display: 'flex'
  }

  const sideBySide = {
    flex: 1,
    margin: '1px',
    border: '2px solid #ccc',
    padding: '4px',
  }

  return (
    <div>
      <div style={row}>
        <div style={sideBySide}>
          <DigitalRead isOn={localChangesOn} label="Local Changes" color="orange"/>
        </div>
        <div style={sideBySide}>
          <DigitalRead isOn={fetchPushed} label="Fetch" color="green" />
        </div>
        <div style={sideBySide}>
          <DigitalRead isOn={errorOn} label="Error" color="red" />
        </div>
      </div>
      <div style={row}>
        <div style={sideBySide}>
          <DigitalRead isOn={isDevelop} label="Develop" color="green"/>
        </div>
        <div style={sideBySide}>
          <DigitalRead isOn={isMaster} label="Master" color="green" />
        </div>
        <div style={sideBySide}>
          <DigitalRead isOn={isFeatureBranch} label="Feature Branch" color="green" />
        </div>
      </div>
    </div>
  );
}

export default GitDashboard;
