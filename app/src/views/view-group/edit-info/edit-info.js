import { useContext, useState } from "react";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";
import { HSpacer, WSpacer } from "../../../components/spacer/spacer";
import { Error } from "../../../components/text/error/error";
import { DialogContext } from "../../../context/dialog/dialog.context";
import { LoaderContext } from "../../../context/loader/loader.context";
import { GroupService } from "../../../services/group.service";
import { Objects } from "../../../utils/object.utils";
import { Strings } from "../../../utils/string.utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import "./edit-info.css";

function EditInfo(props) {
  const { executeWithLoading } = useContext(LoaderContext);
  const { hide } = useContext(DialogContext);
  const [group, setGroup] = useState(props.group);
  const [minValue, setMinValue] = useState(
    Strings.parseNumberToString(props.group.minValue)
  );
  const [maxValue, setMaxValue] = useState(
    Strings.parseNumberToString(props.group.maxValue)
  );
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  function updateGroup() {
    setGroup({ ...group });
  }

  function updateErrors() {
    setErrors({ ...errors });
  }

  function handleCancel(e) {
    e.preventDefault();
    hide();
  }

  async function handleSave(e) {
    e.preventDefault();

    group.minValue = Strings.parseMoneyToNumber(minValue);
    group.maxValue = Strings.parseMoneyToNumber(maxValue);
    const errors = GroupService.isValidGroup(group);
    if (Objects.isEmpty(errors)) {
      const error = await executeWithLoading(GroupService.update(group));
      if (Objects.isNotEmpty(error)) {
        setError(error);
      } else {
        hide();
      }
    } else {
      setErrors(errors);
    }
  }

  function handleGroupNameChange(e) {
    errors.name = "";
    updateErrors();
    group.name = e.target.value;
    updateGroup();
  }

  function handleDateChange(e) {
    errors.date = "";
    updateErrors();
    group.date = e.target.value;
    updateGroup();
  }

  function handleMinValueChange(e) {
    errors.minValue = "";
    updateErrors();
    setMinValue(e.target.value);
    updateGroup();
  }

  function handleMaxValueChange(e) {
    errors.maxValue = "";
    updateErrors();
    setMaxValue(e.target.value);
    updateGroup();
  }

  return (
    <div className="EditInfo">
      <Input
        value={group.name}
        onChange={handleGroupNameChange}
        label="Shopping List Name"
        id="group-name"
        type="text"
        error={errors.name}
        required
      />
      <HSpacer height="16px" />
      <Input
        value={group.date}
        onChange={handleDateChange}
        label="List Date"
        id="date"
        type="date"
        error={errors.date}
        required
      />
      <HSpacer height="16px" />
      <Button onClick={handleSave}>Save</Button>
      <HSpacer height="8px" />
      <Button onClick={handleCancel}>
          <FontAwesomeIcon icon={faTimes} className="Icon" />
          <WSpacer width="5px" />Cancel
      </Button>
      <Error center>{error}</Error>
      <HSpacer height="16px" />
    </div>
  );
}

export { EditInfo };
