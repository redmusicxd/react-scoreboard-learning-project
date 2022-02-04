import React, { useEffect } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  FormControl,
  Input,
  FormLabel,
  Button,
  SimpleGrid,
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup  size='sm'>
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    // <Flex justifyContent='center'>
      <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
    // </Flex>
  )
}

function playersObj(total) {
  let obj = {};
  for(let i = 1; i <= total; i++) {
    obj[`player_${i}`] = {name: `Player ${i}`, score: 0};
  }
  return obj;
}



function App() {
  var [totalPlayers, setTotalPlayers] = React.useState(4);
  var [score, setScore] = React.useState(playersObj(totalPlayers));
  var [highScore, setHighScore] = React.useState({name: "", score: 0});
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if(Object.keys(score).length > 0) {
      let arr = Object.values(score);
      let maxVal = Math.max(...arr.map(x => x.score));
      let maxKey = Object.keys(score).find(key => score[key].score === maxVal);
      setHighScore(score[maxKey]);
    }
  }, [score])

  const handleChange = (val) => {
    let copy = score;
      if(Object.keys(score).length > Number(val)) {
        // console.log(Object.keys(score).length, val);
        Array.from({length: Object.keys(score).length}, (v, k) => k + Number(val) + 1).forEach(key => {
          // console.log(key);
          if(key !== Number(val))
            delete copy[`player_${key}`];
        })
        // console.log(copy);
        setScore(copy);
        setTotalPlayers(Number(val));
        let arr = Object.values(copy);
        let maxVal = Math.max(...arr.map(x => x.score));
        let maxKey = Object.keys(copy).find(key => copy[key].score === maxVal);
        setHighScore(copy[maxKey]);
    } else {
      Array.from({length: val}, (v, k) => k + 1).forEach(key => {
        if(!copy[`player_${key}`]) {
          copy[`player_${key}`] = {name: `Player ${key}`, score: 0};
        }
      })
      setScore(copy);
      setTotalPlayers(Number(val));
    }
  }

  // const handleDeletePlayer = (key) => {
  //   console.log(key);
  //   let copy = score;
  //   delete copy[key];
  //   console.log(copy);
  //   setScore(copy);
  // }

  return (
    <ChakraProvider theme={theme}>
      <Container textAlign="center" p={0} m={0} maxW={'full'} h={"100vh"} overflow={"auto"}>
        
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Scoreboard Menu</DrawerHeader>
            <DrawerBody>
              <FormControl>
                <FormLabel htmlFor="totalPlayers">Total Players</FormLabel>
                <Input value={totalPlayers} type="number" onChange={e => e.target.value && handleChange(e.target.value)}/>
              </FormControl>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
          {/* <Box as="header" w={"full"} h={50} bg={"gray.500"}> */}
          <HStack as={"header"} bg={"gray.500"} h={16} position={'sticky'} zIndex={2} top={0}>
            <Button
            onClick={onOpen}
            key={"fds"}
            m={4}
          ><HamburgerIcon/></Button>
            <Heading fontSize={'2xl'}>{`Highscore: ${highScore.score} ${highScore.score > 0 ? `by ${highScore.name}` : ""} `}</Heading>
          </HStack>
          {/* </Box> */}
          <SimpleGrid columns={2} spacing={5} alignContent={"center"} alignItems={"flex-end"} px={5} py={5}>
            {Object.keys(score).map((el, i) => 
            <>
              <FormControl key={i}>
                <FormLabel>                
                  <Editable defaultValue={score[el].name} onSubmit={(e) => setScore({...score, [`player_${i + 1}`]: {...score[el], name: e}})}>
                  <HStack>
                    <EditablePreview />
                    <EditableInput />
                    <EditableControls />
                    {/* <Button size={"sm"} onClick={() => handleDeletePlayer(`player_${i + 1}`)}><DeleteIcon /></Button> */}
                  </HStack>
                </Editable></FormLabel>
                <Input defaultValue={0} value={score[el].score} onChange={(e) => setScore({...score, [`player_${i + 1}`]: {...score[el], score: Number(e.target.value)}})}/>
              </FormControl>
              <HStack key={`i${1}`}>
                <Button w={"full"} onClick={() => setScore({...score, [`player_${i + 1}`]: {...score[el], score: Number(score[el].score) + 1}})}>+ 1</Button>
                <Button w={"full"} onClick={() => setScore({...score, [`player_${i + 1}`]: {...score[el], score: Number(score[el].score) - 1}})}>- 1</Button>
              </HStack>
            </>)}
          </SimpleGrid>
      </Container>
    </ChakraProvider>
  );
}

export default App;
