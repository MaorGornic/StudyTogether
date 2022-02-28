/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Heading,
  Input,
  VStack,
  Box,
  Alert,
  AlertIcon,
  CloseButton,
  Select,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Text,
  Textarea,
  Image,
} from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';
import { connect } from 'react-redux';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input/input';
import { WithContext as ReactTags } from 'react-tag-input';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../actions';
import * as colors from '../../utils/colors';
import { apiURL, userRoles } from '../../utils/constants';
import Map from '../../components/Map';
import GreenButton from '../../components/GreenButton';

function GroupCreator({ authToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const [state, setState] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    phone: '',
    image:
      'https://image.freepik.com/free-vector/study-group-illustration-with-students-study-together-after-class-as-concept-this-illustration-can-be-use-website-landing-page-web-app-banner_9829-25.jpg',
    currAttendees: 1,
    maxAttendees: 2,
    description: '',
    tags: [{ id: 'dfgh7d9ssdga', text: 'CSC301' }],
    locationLat: null,
    locationLng: null,
    finalDate: new Date(),
  });

  const [errors, setErrors] = useState({
    title: false,
    password: false,
    date: false,
    startTime: false,
    endTime: false,
    phone: false,
    image: false,
    currAttendees: false,
    maxAttendees: false,
    description: false,
    tags: false,
    location: false,
  });
  const [forceHideAlert, setForceHideAlert] = useState(false);

  const handleChange = event => {
    const { value, name } = event.target;
    const newState = state;

    switch (name) {
      case 'title':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'image':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'currAttendees':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'maxAttendees':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'description':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'phone':
        setErrors({ ...errors, [name]: false });
        newState[name] = value;
        break;
      case 'recurring':
        newState[name] = value;
        break;
      default:
        console.log('Name does not exist.');
    }
    setState({ ...state, ...newState });
  };

  const combineDateAndTimeIntoDateTime = (date, time) => {
    const dateTimeToReturn = new Date(date.getTime());
    const [timeHour, timeMin] = time.split(':');
    dateTimeToReturn.setHours(timeHour);
    dateTimeToReturn.setMinutes(timeMin);
    dateTimeToReturn.setSeconds(0);
    return dateTimeToReturn;
  };

  // code taken from here https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  const validatePhoneNumber = phone => {
    const regexEx = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return !!String(phone).toLowerCase().match(regexEx);
  };

  const imageUrlValid = imageUrl =>
    ['png', 'jpg', 'jpeg'].includes(
      imageUrl.substring(imageUrl.lastIndexOf('.') + 1)
    );

  const handleSubmit = () => {
    const groupTitleInvalid = state.title.length < 4;
    const phoneInvalid = !validatePhoneNumber(state.phone);
    const imageUrlInvalid = !imageUrlValid(state.image);

    const tagsInvalid = state.tags.length === 0;
    const dateInvalid = !state.date;
    const locationInvalid =
      state.locationLng === null || state.locationLat === null;

    const startTimeInvalid = state.startTime === null || state.startTime === '';
    const endTimeInvalid = state.endTime === null || state.endTime === '';

    const descriptionInvalid = state.description.length < 10;
    setForceHideAlert(false);
    if (
      [
        groupTitleInvalid,
        phoneInvalid,
        imageUrlInvalid,
        descriptionInvalid,
        tagsInvalid,
        dateInvalid,
        locationInvalid,
        startTimeInvalid,
        endTimeInvalid,
      ].some(boolean => boolean)
    )
      setErrors({
        ...errors,
        title: groupTitleInvalid,
        phone: phoneInvalid,
        image: imageUrlInvalid,
        description: descriptionInvalid,
        tags: tagsInvalid,
        date: dateInvalid,
        location: locationInvalid,
        startTime: startTimeInvalid,
        endTime: endTimeInvalid,
      });
    else {
      const body = {
        title: state.title,
        startDateTime: combineDateAndTimeIntoDateTime(
          state.date,
          state.startTime
        ),
        endDateTime: combineDateAndTimeIntoDateTime(state.date, state.endTime),
        phone: state.phone,
        finalDate: state.finalDate,
        imageUrl: state.image,
        currAttendees: state.currAttendees,
        maxAttendees: state.maxAttendees,
        recurring: state.recurring,
        description: state.description,
        location: {
          lat: state.locationLat,
          lng: state.locationLng,
        },
        tags: state.tags.reduce((acc, curr) => {
          acc.push(curr.text);
          return acc;
        }, []),
      };

      const config = {
        headers: { Authorization: `JWT ${authToken}` },
      };
      axios
        .post(`${apiURL}/studygroups/create`, body, config)
        .then(res => {
          navigate('/');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleDelete = i => {
    setState({
      ...state,
      tags: [...state.tags.filter((tag, index) => index !== i)],
    });
  };

  const handleAddition = tag => {
    setState({
      ...state,
      tags: [...state.tags, tag],
    });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = state.tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setState({
      ...state,
      tags: [...newTags],
    });
  };

  const setLocation = (lat, lng) => {
    setState({ ...state, locationLat: lat, locationLng: lng });

    setErrors({ ...errors, location: lat === null || lng === null });
  };

  return (
    <div style={{ height: '49vh' }}>
      {authToken === null ? (
        <Alert status="warning">
          <AlertIcon />
          You need to be logged in to create a study group. Redirecting you to
          the login page now...
        </Alert>
      ) : (
        <>
          <Box style={{ width: '60%', margin: 'auto', marginTop: '2rem' }}>
            <VStack
              style={{ marginTop: '1rem' }}
              spacing="20px"
              align="stretch"
            >
              <Heading as="h2" size="2xl">
                Create a Group
              </Heading>
              <Flex justify="center" width="100%">
                {!imageUrlValid(state.image) ? (
                  <div
                    style={{
                      height: '300px',
                      padding: '5rem',
                    }}
                  >
                    <div style={{ height: 'auto' }}>
                      Image invalid. We only allow png, jpg, jpeg images.{' '}
                    </div>
                  </div>
                ) : (
                  <Image src={state.image} alt="Group image" height="300px" />
                )}
              </Flex>

              <VStack spacing="20px" align="stretch">
                <Input
                  name="title"
                  autoComplete="off"
                  errorBorderColor="crimson"
                  isInvalid={errors.title}
                  placeholder="Group Name"
                  onChange={handleChange}
                  value={state.title}
                />
                <Input
                  name="image"
                  autoComplete="off"
                  errorBorderColor="crimson"
                  isInvalid={errors.image}
                  placeholder="Group Image URL"
                  onChange={handleChange}
                  value={state.image}
                />
                <HStack>
                  <span style={{ marginRight: '1rem' }}>
                    Host Phone number:
                  </span>
                  <div
                    style={{
                      border: errors.phone
                        ? 'solid 2px crimson'
                        : 'solid 1px var(--chakra-colors-gray-200)',
                      borderRadius: 'var(--chakra-radii-md)',
                      padding: '3px',
                    }}
                  >
                    <PhoneInput
                      placeholder="905-142-9344"
                      value={state.phone}
                      focusBorderColor
                      onChange={value =>
                        handleChange({ target: { value, name: 'phone' } })
                      }
                    />
                  </div>
                </HStack>
                <HStack>
                  <span style={{ marginRight: '1rem' }}>
                    Curent number of ateendees{' '}
                  </span>
                  <NumberInput name="currAttendees" value={state.currAttendees}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        onClick={() =>
                          setState({
                            ...state,
                            currAttendees: Math.min(
                              state.currAttendees + 1,
                              100
                            ),
                          })
                        }
                      />
                      <NumberDecrementStepper
                        onClick={() =>
                          setState({
                            ...state,
                            currAttendees: Math.max(state.currAttendees - 1, 1),
                          })
                        }
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>

                <HStack>
                  <span style={{ marginRight: '1rem' }}>
                    Maximum number of ateendees{' '}
                  </span>
                  <NumberInput name="maxAttendees" value={state.maxAttendees}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        onClick={() =>
                          setState({
                            ...state,
                            maxAttendees: Math.min(state.maxAttendees + 1, 100),
                          })
                        }
                      />
                      <NumberDecrementStepper
                        onClick={() =>
                          setState({
                            ...state,
                            maxAttendees: Math.max(state.maxAttendees - 1, 2),
                          })
                        }
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
                <HStack gap="1rem">
                  <span style={{ width: '80px' }}>Date </span>
                  <div
                    style={{
                      border: errors.date
                        ? 'solid 2px crimson'
                        : 'solid 1px var(--chakra-colors-gray-200)',
                      borderRadius: 'var(--chakra-radii-md)',
                      padding: '2px',
                    }}
                  >
                    <DatePicker
                      name="startDate"
                      selected={state.date}
                      onChange={date => {
                        setState({ ...state, date });
                        setErrors({ ...errors, date: false });
                      }}
                    />
                  </div>
                </HStack>

                <Flex gap="1rem">
                  <span style={{ width: '80px' }}>Start time </span>
                  <TimePickerWrapper
                    style={{
                      border: errors.startTime ? 'solid 2px crimson' : 'none',
                      padding: '-2px',
                      borderRadius: 'var(--chakra-radii-md)',
                    }}
                  >
                    <TimePicker
                      name="startTime"
                      maxDetail="minute"
                      hourPlaceholder="09"
                      minutePlaceholder="00"
                      value={state.startTime}
                      disableClock
                      onChange={time => setState({ ...state, startTime: time })}
                    />
                  </TimePickerWrapper>
                </Flex>
                <Flex gap="1rem">
                  <span style={{ width: '80px' }}>End time </span>
                  <TimePickerWrapper
                    style={{
                      border: errors.endTime ? 'solid 2px crimson' : 'none',
                      padding: '-2px',
                      borderRadius: 'var(--chakra-radii-md)',
                    }}
                  >
                    <TimePicker
                      name="endTime"
                      maxDetail="minute"
                      hourPlaceholder="11"
                      minutePlaceholder="00"
                      value={state.endTime}
                      disableClock
                      onChange={time => setState({ ...state, endTime: time })}
                    />
                  </TimePickerWrapper>
                </Flex>
                <HStack>
                  <span style={{ marginRight: '1rem' }}>Recurring: </span>
                  <Select
                    className="custom-select"
                    name="recurring"
                    isInvalid={errors.role}
                    placeholder=""
                    onChange={handleChange}
                  >
                    <option value="N/A">N/A</option>
                    <option value="weekly">weekly</option>
                    <option value="bi-weekly">bi-weekly</option>
                  </Select>
                  <span style={{ width: '425px', marginLeft: '1rem' }}>
                    Final session date:{' '}
                  </span>
                  <DatePicker
                    name="finalDate"
                    style={{
                      border: '1px solid black !important',
                      width: 'auto',
                    }}
                    selected={state.finalDate}
                    onChange={finalDate => setState({ ...state, finalDate })}
                  />
                </HStack>
                <>
                  <Text mb="8px">Description</Text>
                  <Textarea
                    name="description"
                    value={state.description}
                    onChange={handleChange}
                    placeholder="We will be..."
                    size="sm"
                    errorBorderColor="crimson"
                    isInvalid={errors.description}
                  />
                </>
                <VStack align="left" style={{ width: '100%' }}>
                  <Text mb="8px">Group Tags</Text>
                  <ReactTagsWrapper
                    style={{
                      border: errors.tags ? 'solid 2px crimson' : 'none',
                      padding: '2px',
                    }}
                  >
                    <ReactTags
                      tags={state.tags}
                      // delimiters={delimiters}
                      style={{ width: '100%' }}
                      handleDelete={handleDelete}
                      handleAddition={handleAddition}
                      handleDrag={handleDrag}
                      inputFieldPosition="bottom"
                      autocomplete
                    />
                  </ReactTagsWrapper>
                </VStack>
              </VStack>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: '20px',
                }}
              >
                <GreenButton
                  onClick={handleSubmit}
                  colorScheme="green"
                  bg={colors.green.dark}
                  style={{ alignSelf: 'flex-start' }}
                  // isLoading
                  // spinner={<BeatLoader size={8} color="white" />}
                  _hover={{ bg: colors.green.medium }}
                  borderColor={colors.green.dark}
                  _active={{
                    bg: colors.green.light,
                    transform: 'scale(0.98)',
                    borderColor: colors.green.dark,
                  }}
                  _focus={{
                    boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
                  }}
                  // isLoading={authState.loading || false}
                >
                  Create Group
                </GreenButton>
                {!forceHideAlert && Object.values(errors).some(item => item) && (
                  <Alert status="error" style={{ paddingRight: '2rem' }}>
                    <AlertIcon />
                    Some of the input fields are empty or invalid. Please also
                    make sure you selected a location using the map below.
                    <CloseButton
                      position="absolute"
                      right="8px"
                      top="8px"
                      onClick={() => setForceHideAlert(true)}
                    />
                  </Alert>
                )}
              </div>
            </VStack>
          </Box>
          <Box
            style={{
              margin: 'auto',
              marginTop: '4rem',

              border: errors.location ? 'solid 3px crimson' : 'none',
            }}
          >
            <Map restrictToOneMarker getLngLatOfNewMarker={setLocation} />
          </Box>
        </>
      )}
    </div>
  );
}

const ReactTagsWrapper = styled.div`
  .ReactTags__tags {
    .ReactTags__tagInput {
      .ReactTags__tagInputField {
        width: 100% !important;
      }
    }
  }
`;
const TimePickerWrapper = styled.div`
  .react-time-picker {
    .react-time-picker__wrapper {
      border: solid 1px var(--chakra-colors-gray-200);
      border-radius: var(--chakra-radii-md);

      .react-time-picker__clear-button {
        display: none;
      }
    }
  }
`;

GroupCreator.propTypes = {
  authToken: PropTypes.string,
};

GroupCreator.defaultProps = { authToken: '' };

export default connect(state => ({
  // eslint-disable-next-line no-undef
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(GroupCreator);
