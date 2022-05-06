import { useState, useContext } from "react";
import { Bar } from "../../../components/bar/bar";
import { Button } from "../../../components/button/button";
import { Input } from "../../../components/input/input";
import { ListItem } from "../../../components/list/list-item/list-item";
import { HSpacer, WSpacer } from "../../../components/spacer/spacer";
import { Subtitle } from "../../../components/text/subtitle/subtitle";
import { Text } from "../../../components/text/text";
import { DialogContext } from "../../../context/dialog/dialog.context";
import { GroupService } from "../../../services/group.service";
import { Objects } from "../../../utils/object.utils";
import { LoaderContext } from "../../../context/loader/loader.context";
import { Error } from "../../../components/text/error/error";
import { AuthService } from "../../../services/auth.service";
import { Strings } from "../../../utils/string.utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import "./edit-members.css";

function EditMembers(props) {
  const { executeWithLoading } = useContext(LoaderContext);
  const { hide } = useContext(DialogContext);
  const [user] = useState(AuthService.getUser());
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState("");
  const [group, setGroup] = useState(props.group);
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");

  function updateErrors() {
    setError("");
    setErrors({ ...errors });
  }

  function updateGroup() {
    setGroup({ ...group });
  }

  function cleanMemberFields() {
    setMemberName("");
    setMemberPhone("");
  }

  function handleMemberNameChange(e) {
    errors.memberName = "";
    updateErrors();
    setMemberName(e.target.value);
  }

  function handleMemberPhoneChange(e) {
    errors.memberPhone = "";
    updateErrors();
    setMemberPhone(e.target.value);
  }

  function handleRemoveMember(phone) {
    group.members = group.members.filter((member) => member.phone !== phone);
    updateGroup();
  }

  function handleAddMember(e) {
    e.preventDefault();
    const member = {
      name: memberName,
      phone: Strings.removeNonNumericCharacters(memberPhone),
    };
    const errors = GroupService.isValidMember(member, group.members);
    if (Objects.isEmpty(errors)) {
      group.members.push(member);
      updateGroup();
      cleanMemberFields();
    } else {
      setErrors(errors);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    const error = await executeWithLoading(GroupService.update(group));
    if (Objects.isNotEmpty(error)) {
      setError(error);
    } else {
      hide();
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    hide();
  }

  return (
    <div className="EditMembers">
      <Input
        value={memberName}
        onChange={handleMemberNameChange}
        label="Member name"
        id="member-name"
        type="text"
        error={errors.memberName}
        required
      />
      <HSpacer height="16px" />
      <Input
        value={memberPhone}
        onChange={handleMemberPhoneChange}
        label="Member phone number"
        id="member-phone"
        type="tel"
        error={errors.memberPhone}
        required
      />
      <HSpacer height="16px" />
      <Button onClick={handleAddMember}>Add Member</Button>
      <HSpacer height="16px" />
      <Bar />
      <HSpacer height="4px" />
      <Subtitle>Member List</Subtitle>
      <div className="MemberList">
        {group.members.map((member, index) => (
          <ListItem key={index} id={member.phone} onClick={handleRemoveMember}>
            <Text>
              {member.phone === user.phone ? "[You]" : ""} {member.name} (
              {member.phone})
            </Text>
          </ListItem>
        ))}
      </div>
      <Error center>{error}</Error>
      <HSpacer height="16px" />
      <Button onClick={handleSave}>Save</Button>
      <HSpacer height="8px" />
      <Button onClick={handleCancel}>
          <FontAwesomeIcon icon={faTimes} className="Icon" />
          <WSpacer width="5px" />Cancel
      </Button>
      <HSpacer height="16px" />
    </div>
  );
}

export { EditMembers };
