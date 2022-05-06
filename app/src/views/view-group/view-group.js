import * as React from 'react';
import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/button/button";
import { Card } from "../../components/card/card";
import { HSpacer } from "../../components/spacer/spacer";
import { Error } from "../../components/text/error/error";
import { Subtitle } from "../../components/text/subtitle/subtitle";
import { Text } from "../../components/text/text";
import { Title } from "../../components/text/title/title";
import { AppRoutes } from "../../constants/routes.constants";
import { GroupService } from "../../services/group.service";
import { Dates } from "../../utils/date.utils";
import { Objects } from "../../utils/object.utils";
import { Strings } from "../../utils/string.utils";
import { Utils } from "../../utils/utils";
import { DialogContext } from "../../context/dialog/dialog.context";
import { EditMembers } from "./edit-members/edit-members";
import { EditInfo } from "./edit-info/edit-info";
import { LoaderContext } from "../../context/loader/loader.context";
import { AuthService } from "../../services/auth.service";
import { TextArea } from "../../components/text-area/text-area";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WSpacer } from "../../components/spacer/spacer";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { Products } from "../../constants/products.constants";
import { ListItem } from "../../components/list/list-item/list-item";
import { Bar } from "../../components/bar/bar";
import { Input } from "../../components/input/input";


import "./view-group.css";

function ViewGroup() {
  const navigate = useNavigate();
  const { executeWithLoading } = useContext(LoaderContext);
  const { display, setOnHideListenner } = useContext(DialogContext);
  const [searchParams] = useSearchParams();
  const [user] = useState(AuthService.getUser());
  const [isOwner, setIsOwner] = useState(false);
  const [group, setGroup] = useState();
  const [wishes, setWishes] = useState("");
  const [wishesError, setWishesError] = useState("");
  const [errors, setErrors] = useState("");
  const [refreshGroup, setRefreshGroup] = useState(0);
  const [items, setItems] = useState([]);
  const [minValue, setMinValue] = useState("0");

  useEffect(() => {
    let updateGroup = (group) => {
      const userPhone = AuthService.getUserPhone();
      setIsOwner(userPhone === group.owner);
      setGroup(group);
      setItems(group.items)

      const userMember = group.members.find((m) => m.phone === userPhone);
      if (Objects.isNotEmpty(userMember)) {
        setWishes(userMember.wishes);
      }
    };

    let updateFatalError = async (error) => {
      setErrors({
        fatal: error,
      });
      await Utils.sleep(2500);
      navigate(AppRoutes.MyGroups);
    };

    const fetchData = async () => {
      const id = Strings.parseInt(searchParams.get("id"));
      if (isNaN(id)) {
        updateFatalError("Grupo inválido, retornando ao menu");
      } else {
        const groupOrError = await executeWithLoading(GroupService.get(id));
        if (
          Objects.isNotEmpty(groupOrError) &&
          Objects.isString(groupOrError)
        ) {
          updateFatalError(groupOrError);
        } else {
          updateGroup(groupOrError);
        }
      }
    };

    fetchData();

    //TODO: Fix it to create a real listenner
    setOnHideListenner(() => {});

    return () => {
      updateGroup = () => {};
      updateFatalError = () => {};
    };
  }, [searchParams, navigate, refreshGroup, setOnHideListenner]);

  async function handleSaveWishes() {
    const error = await executeWithLoading(
      GroupService.saveWishes(group.id, wishes)
    );
    if (Objects.isNotEmpty(error)) {
      setWishesError(error);
    }
  }

  function handleWishesChange(e) {
    setWishes(e.target.value);
  }

  function handleAddMember() {
    display(<EditMembers group={group} />);
  }

  async function handleSort() {
    const error = await GroupService.sort(group.id);
    if (Objects.isNotEmpty(error)) {
      setErrors({
        sort: error,
      });
    } else {
      setRefreshGroup(refreshGroup + 1);
    }
  }

  async function handleRemoveGroup() {
    const error = await GroupService.delete(group.id);
    if (Objects.isNotEmpty(error)) {
      setErrors({
        delete: error,
      });
    } else {
      navigate(AppRoutes.MyGroups);
    }
  }

  function handleBack() {
    navigate(AppRoutes.MyGroups);
  }

  function handleEditInfo() {
    display(<EditInfo group={group} />);
  }

  function handleAddProduct(e, product, quantity){
    e.preventDefault();
    items.push({
      id: uuidv4(), 
      user: user,
      upc: product.upc,
      name: product.name,
      total: product.price * quantity,
      quantity: quantity,
    });
    setItems([...items]);
  }

  function handleRemoveItem(id) {    
    setItems([...items.filter(item => item.id !== id)]);
  }

  function handleQuantityChange(e) {
    setMinValue(e.target.value)
  }

  const optionsItems = Products.Default;
  const [inputValue, setInputValue] = React.useState(null);

  return (
    <div className="ViewGroup">
      <Error>{errors.fatal}</Error>
      {group && (
        <>
          <Title>{group.name}</Title>
          <Card>
            
            {/* <Text>
              O amigo secreto será feito no dia {Dates.formatDate(group.date)}
            </Text> */}
            <HSpacer height="8px" />
            {/* <Text>
              Valor mínimo: {Strings.parseNumberToMoneyString(group.minValue)}
            </Text> */}
            <Text>
            Estimated Total: {Strings.parseNumberToMoneyString(group.maxValue)}
            </Text>
            {!group.secretFriend && isOwner && (
              <>
                <HSpacer height="4px" />
                <Button onClick={handleEditInfo}>Edit List Info</Button>
              </>
            )}
            <HSpacer height="8px" />
          </Card>
          <HSpacer height="16px" />
          <Card>
            <Subtitle>Members List ({group.members.length})</Subtitle>
            {group.members.map((member, index) => (
              <Text key={index}>
                - {member.name} ({member.phone})
              </Text>
            ))}
            {!group.secretFriend && isOwner && (
              <>
                <HSpacer height="16px" />
                <Button onClick={handleAddMember}>Add members</Button>
              </>
            )}
          </Card>
 
          <HSpacer height="16px" />
          {items && (
          <Card>
            <Subtitle>Shopping List Items</Subtitle>

              {(items.length === 0) && (<Text>Empty shopping list</Text>)}
              {items.map((product, index) => (
                  <ListItem
                    key={index}
                    id={product.id}
                    onClick={handleRemoveItem}
                  >
                    <Text>
                      {product.name} - Qtde: {product.quantity} - Total: {product.total}
                    </Text>
                  </ListItem>       
              ))}
            <HSpacer height="4px" />
            < Bar />
            <HSpacer height="16px" />
            <Subtitle>Add Item</Subtitle>

            <Autocomplete
              value={inputValue}
              onChange={(event, newValue) => {
                setInputValue(newValue);
              }} 
              id="controllable-states-demo"
              options={optionsItems}
              getOptionLabel={option => option.name}
              sx={{ width: `100%` }}
              renderInput={(params) => <TextField {...params} label="Items List" />}
            />
            <Input
              value={minValue}
              onChange={(e) => handleQuantityChange(e)}
              label="Quantity"
              id="quantity"
              type="number"
              error={errors.name}
              
            />
            <HSpacer height="16px" />
            <Button onClick={(e) => handleAddProduct(e, inputValue, minValue)} >
              Add Item
            </Button>
          </Card>
)}
          <HSpacer height="16px" />
            {group.members.some((m) => m.phone === user.phone) && (
            <>
              <Card>
                <Subtitle>Notes</Subtitle>
                <TextArea
                  id="wishes"
                  onChange={handleWishesChange}
                  cols="30"
                  rows="5"
                >
                  {wishes}
                </TextArea>
              
              
                <HSpacer height="16px" />
                <Button onClick={handleSaveWishes}>Save Notes</Button>
                <Error center>{wishesError}</Error>
              </Card>
            </>
          )}

          <HSpacer height="16px" />
          {isOwner && (
            <Button onClick={handleRemoveGroup}>      
              <FontAwesomeIcon icon={faTrash} className="Icon" />
              <WSpacer width="5px" />
              Delete List
            </Button>
          )}
          <Error center>{errors.delete}</Error>
          <HSpacer height="16px" />
          <Button onClick={handleBack} className="kds-Button kds-Button--cancel w-full sm:w-1/5">
            <FontAwesomeIcon icon={faArrowLeft} className="Icon" />
            <WSpacer width="5px" />Back
          </Button>
          <HSpacer height="16px" />
        </>
      )}
    </div>
  );
}

export { ViewGroup };
