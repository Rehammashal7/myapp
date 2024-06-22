import { Dimensions, StyleSheet } from "react-native";


const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
const cardheight = height / 2 - 30;
const cardwidth = width / 2;

const Homestyles =(COLORS)=> StyleSheet.create({
    cardView: {
        marginBottom: 20,
        marginTop: 5,
        marginRight: 5,
        borderRadius: 5,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: COLORS.background,
    },
    discoverButton: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: COLORS.lightGray,
    },
    discoverText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        marginTop: (cardheight + 30) / 2
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 70,
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 50,
        bottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
        color:COLORS.dark
    },
    image: {
        position: "relative",
        height: cardheight - 80,
        width: cardwidth,
    },
    Name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.nameC,
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 5,
        height: 40,
        width: cardwidth - 20
    },
    Text: {
        color: COLORS.nameC,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    headerTextView: {
        backgroundColor: COLORS.background,
        // marginTop: 10
    },
    smallCard: {
        // borderRadius: 30,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 70,
        borderBottomColor: "transparent",
        borderBottomWidth: 2,
    },
    smallCardSelected: {
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 70,
        shadowColor: COLORS.dark,
        borderBottomColor: COLORS.dark,
        borderBottomWidth: 2,
    },
    smallCardTextSected: {
        color: COLORS.dark,
    },
    priceO: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 10,
        textDecorationLine: "line-through",
        height: 20,
        color:COLORS.nameC
    },
    regularText: {
        fontWeight: "normal",
        fontSize: 16,
        color:COLORS.dark,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
        color:COLORS.dark
    },
    smallCardText: {
        fontSize: 14,
        color: COLORS.dark,
        textAlign: "center",
        marginTop: 5,
    },
});
export default Homestyles;

export const card =(COLORS)=> StyleSheet.create({
    cardView: {
        marginHorizontal: 1,
        marginBottom: 30,
        marginTop: 0,
        width: cardwidth,
        height: 370,
        elevation: 13,
        backgroundColor: COLORS.white,
    },
    imagee: {
        position: "relative",
        width: 220,
        height: 300,
    },
    dotsContainer: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 262,
    },
    dot: {
        width: (cardwidth / 4) - 10,
        height: 2,
        marginBottom: 20,
        backgroundColor: COLORS.dark,
        marginHorizontal: 5,
    },
    activeDot: {
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    Name: {
        fontSize: 14,
        color: COLORS.nameC,
        marginTop: 0,
        marginLeft: 10,
        marginBottom: 0,
        height: 40
    },
    pricewithoffer: {
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 10,
        textDecorationLine: "line-through",
        color:COLORS.dark
    },
    offer: {
        fontSize: 12,
        fontWeight: "bold",
        marginHorizontal: 9,
        color: COLORS.offerC,
        height: 40
    },
    price: {
        fontSize: 18,
         fontWeight: "bold", 
         marginHorizontal: 10,
         color:COLORS.dark
    }
});

export const productpage =(COLORS)=> StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 35,
        bottom: 20,
    },
    Textt: {
        color: COLORS.nameC,
        fontSize: 35,
        fontFamily: "SofiaRegular",
        fontWeight: "bold",
        alignItems: "center",
    },
    headerName: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: "10%",
    },
    productContainer: {
        padding: 0,
        flex: 1,
        backgroundColor: COLORS.background
    },
    productImage: {
        width: width,
        height: 490,
        marginRight: 10,
    },
    dotsContainerDetails: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 475,
        marginLeft: 175,
    },
    dotDetails: {
        width: 5,
        height: 5,
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: COLORS.dark,
        marginHorizontal: 5,
    },
    activeDotDetails: {
        marginBottom: 20,
        backgroundColor: COLORS.white,
    },
    containerHeart: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 40,
        alignItems: 'center',
    },
    addToFavBtn: {
        paddingTop: 10,
        paddingBottom: 8,
        right: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: 30,
        justifyContent: 'center',
        marginLeft: 20
    },
    containercount: {
        position: 'absolute',
        top: 3,
        right: 45,
        zIndex: 1,
        backgroundColor: COLORS.heart,
        borderRadius: 40,
        alignItems: 'center',
    },
    countcart: {
        paddingTop: 3,
        paddingBottom: 3,
        right: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: 7,
        justifyContent: 'center',
        marginLeft: 20
    },
    colorsContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    sizesContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    colorButton: {
        width: 25,
        height: 25,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    selectedColorButton: {
        borderWidth: 3,
        borderColor: COLORS.dark,
    },
    blackButtonStyle: {
        borderWidth: 2,
        borderColor: COLORS.offerC,
    },
    sizeButton: {
        width: 55,
        height: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 3,
        borderColor:COLORS.dark
    },
    sizeButtonText: {
        position: "relative",
    },
    selectedSizeButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: COLORS.dark,
    },
    sizeText: {
        fontSize: 15,
        color: COLORS.dark,
    },
    NameD: {
        fontSize: 14,
        color: COLORS.nameC,
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 0,
    },
    priceO:{
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 10,
        textDecorationLine: "line-through",
        color:COLORS.dark
      },
      price:{
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 10,
        color:COLORS.dark
      },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: "#b3b3b3",
        marginTop: 2,
    },
    description: {
        fontSize: 15,
        marginTop: 2,
        marginLeft: 10,
        color:COLORS.dark
    },
    bottomBar: {
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderColor: COLORS.grey,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    Navbarr: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10
    },
    reviewButon: {
        backgroundColor: COLORS.dark,
        paddingHorizontal: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center',
        marginLeft: cardwidth / 4,
        width: width - cardwidth / 2,
        marginBottom: 5
    },
    addToCartBton1: {
        backgroundColor: COLORS.dark,
        paddingHorizontal: 20,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
        width: width - cardwidth / 2,
    },
    addToCartBton2: {
        backgroundColor: COLORS.dark,
        paddingHorizontal: 20,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 60,
        width: 150,
    },
    priceText: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.dark,
    },
    reviewContainer: {
        backgroundColor: COLORS.background,
        borderRadius: 10,
        padding: 5,
        marginHorizontal: 5,
        marginBottom: 5,
        elevation: 3,
        width: width - 10,
        justifyContent: 'space-between',
    },
    reviewText: {
        fontSize: 15,
        color:COLORS.dark
    },
    addToCartButtonText: {
        color: COLORS.white,
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.dark,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        color:COLORS.dark
    },
    okButton: {
        backgroundColor: COLORS.dark,
        padding: 5,
    },
    okButtonText: {
        color: COLORS.white,
        fontSize: 16,
    },
});

export const smallCard =(COLORS)=> StyleSheet.create({
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 60,
    },
    smallCard: {
        backgroundColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 60,
        borderBottomColor: "transparent",
        borderBottomWidth: 2,
    },
    smallCardSelected: {
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 60,
        shadowColor: COLORS.dark,
        borderBottomColor: COLORS.dark,
        borderBottomWidth: 2,
    },
    smallCardTextSected: {
        color: COLORS.nameC,
    },
    smallCardText: {
        fontSize: 14,
        color: COLORS.dark,
        textAlign: "center",
        marginTop: 5,
    },
    regularText: {
        fontWeight: "normal",
        fontSize: 16,
        color: COLORS.nameC,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
        color: COLORS.nameC,
    },

});

export const filter =(COLORS)=> StyleSheet.create({
    containerfs: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 5,
        marginBottom: 20
    },
    dropdownButtonStyle: {
        width: 90,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.nameC,
    },
    dropdownButtonArrowStyle: {
        fontSize: 22,
        marginLeft: 5
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    numbertypecontainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-evenly',
        width: 80,
        height: 45,
        borderBottomColor: COLORS.dark,
        borderBottomWidth: 1,
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
        color: '#151E26',
    },
})

export const Navbar =(COLORS)=> StyleSheet.create({
    NavContainer: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 0,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    },
    Navbar: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      width: width,
      justifyContent: 'space-evenly',
      height: 60
    },
    iconBehave: {
      alignItems: 'center',
      marginTop: 3
    },
    Text: {
      fontWeight: "bold",
      color: COLORS.dark
    }
  });

 export const search =(COLORS)=> StyleSheet.create({
    total: {
        width: '90%',
        height: 60,
        backgroundColor: COLORS.white,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    TextInput: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 0,
        borderColor: "#86939e",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    SearchArea: {
        width: "94%",
        height: 40,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.dark,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:10
    },
    searchIcon: {
        marginRight: 10, 
    },
    view1: {
        height: 70,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    view2: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
    },
    icon2: {
        fontSize: 24,
        padding: 5,
        color: COLORS.grey,
    },
    modal: {
        flex: 1
    },
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        width: width,
        justifyContent: 'space-evenly',
        height: 60
    },
    iconBehave: {
        alignItems: 'center',
        marginTop: 3
    },
    Text: {
        fontWeight: "bold",
        color: COLORS.dark
    },
    searchInput: {
        width: '80%',
        borderWidth: 0,
        borderColor: 'transparent',
        height: 25,
        padding: 0,
    },
});

export const FavoriteStyle =(COLORS)=> StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white
    },
    header: {
      flexDirection: "row",
      backgroundColor: COLORS.background,
      height: '10%',
      alignItems: 'center',
      textAlign: 'center'
    },
    Texts: {
      color: COLORS.darkblue,
      fontSize: 35,
      fontFamily: 'SofiaRegular',
      fontWeight: "bold",
      alignItems: 'center',
      marginLeft: width / 2 - 80
    },
    containerHeart: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      backgroundColor: COLORS.white,
      borderRadius: 40,
      alignItems: 'center',
    },
    addToFavBtn: {
      paddingTop: 10,
      paddingBottom: 8,
      right: 10,
      borderRadius: 10,
      alignItems: 'center',
      width: 25,
      justifyContent: 'center',
      marginLeft: 20
    },
    bottoms: {
      flexDirection: "row",
      backgroundColor: COLORS.white,
      height: 50,
      bottom: 20
    },
  });

  export const Categorys =(COLORS)=> StyleSheet.create({
    
    discoverButton: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight - 30,
        elevation: 13,
        backgroundColor: '#ECF0F1',
    },
    containerItem: {
        backgroundColor: COLORS.white
    },
    containerHeart: {
        position: 'absolute',
        marginLeft: 20,
        zIndex: 1,
        borderRadius: 40,
        alignItems: 'center',
    },
    discoverText: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.whitee,
        marginTop: cardheight - 80
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: '10%',
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 60,
        bottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
        margin: 10
    },
    slid: {
        position: "relative",
        height: cardheight - 30,
        width: '95%',
    },
    Text: {
        color: COLORS.darkblue,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    headerTextView: {
        backgroundColor: 'White',
        marginTop: 10
    },
});

export const profilee =(COLORS)=> StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    logoutButton: {
      width: width - 10,
      height: cardheight / 9,
      marginLeft: 5,
      backgroundColor: COLORS.dark,
      padding: 8,
      marginTop: 10,
      alignItems: "center",
    },
    logoutButtonText: {
      color: COLORS.white,
      fontWeight: "bold",
      fontSize: 18,
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 75,
      marginLeft: 10,
      position: "absolute",
      left: 5,
      top: 10,
    },
    welcomecontainer: {
      backgroundColor: COLORS.background,
      width: width - 10,
      height: "20%",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignSelf: "flex-start",
      marginTop: 5,
      marginLeft: 5,
      marginRight: 10,
      borderStyle: "solid",
      borderColor: COLORS.dark,
      borderWidth: 0.5,
      position: "relative",
      textAlign: "right",
    },
    welcomeinput: {
      flex: 1,
      color: COLORS.dark,
      marginLeft: 50,
      marginTop: 10,
      fontSize: 20,
      textAlign: "right",
    },
    pressableContainer: {
      flexDirection: "row",
      marginBottom: 20,
      marginLeft: 30,
    },
    pressable: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderRadius: 5,
      marginRight: 10,
    },
    row: {
      flexDirection: "column",
      alignItems: "center",
    },
    text: {
      color: COLORS.dark,
      fontSize: 17,
      marginLeft: 10,
      flexDirection: "row",
    },
    icon: {
      marginRight: -10,
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    button: {
      marginHorizontal: 5,
      width: cardwidth - 10,
      height: height / 20,
      borderWidth: 1,
      borderColor: COLORS.dark,
      textAlign: "center",
    },
    buttonText: {
      color: COLORS.dark,
      fontSize: 20,
      marginTop: 3,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    ordercontainer: {
      backgroundColor: COLORS.background,
      width: width - 10,
      height: "20%",
      justifyContent: "center",
      alignItems: "flex-start",
      alignSelf: "flex-start",
      marginTop: 10,
      marginLeft: 5,
      marginRight: 10,
      borderStyle: "solid",
      borderColor:COLORS.dark,
      borderWidth: 0.5,
    },
    SeeAll: {
      position: "absolute",
      top: 10,
      right: 15,
      alignSelf: "flex-end",
      color: COLORS.dark,
      marginRight: 5,
      textDecorationLine: "underline",
    },
    bounsText: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.dark,
      marginTop: 10,
      marginLeft: 10,
    },
    walletText: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.dark,
      marginTop: 10,
      marginLeft: 30,
    },
    pencil: {
      position: "absolute",
      top: 15,
      right: 15,
    },
    aboutuscontainer: {
      flexDirection: "row",
      width: width - 10,
      height: height / 18,
      alignItems: "center",
      marginLeft: 10,
      marginTop: 10,
      backgroundColor: COLORS.background,
      borderStyle: "solid",
      borderColor: COLORS.dark,
      // borderWidth: 0.5,
  
    },
    abouttext: {
      fontSize: 20,
      marginLeft: 10,
  color:COLORS.dark
  
    },
    textAndArrowContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 5,
      marginRight:8
    },
  });

  export const cartStyle =(COLORS)=> StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: COLORS.white
    },
    containerTotal: {
      padding: 10,
      borderWidth: 0.1,
      borderColor: COLORS.grey,
      borderWidth: 0.1,
      borderRadius: 1,
      elevation: 13,
      flexDirection: 'column',
      backgroundColor: COLORS.white,
      marginBottom: 10,
      margin: 5
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    header: {
      flexDirection: "row",
      backgroundColor: COLORS.background,
      height: '10%',
      alignItems: 'center',
      textAlign: 'center'
    }, Text: {
      color: COLORS.darkblue,
      fontSize: 35,
      fontFamily: 'SofiaRegular',
      fontWeight: "bold",
      alignItems: 'center',
      marginLeft: width / 2 - 80
  
    },
    headerTextView: {
      backgroundColor: 'White',
      marginTop: 10
    }, headerText: {
      fontSize: 20,
      fontWeight: "bold",
      alignItems: 'center',
      margin: 10
    },
    deliveryText: {
      marginLeft: 60,
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.grey
    },
    iconBehave: {
      marginTop: 50,
      marginLeft: 10,
      marginRight: 10
    },
    cardView: {
      flexDirection: 'row',
      marginBottom: 5,
      marginTop: 20,
      borderRadius: 15,
      width: width - 20,
      height: 210,
      elevation: 13,
      backgroundColor: COLORS.white,
      marginLeft: 20,
    },
    cardView2: {
      marginBottom: 20,
      marginTop: 5,
      marginRight: 5,
      borderRadius: 15,
      width: cardwidth,
      height: cardheight - 30,
      elevation: 13,
      backgroundColor: 'white',
    },
    itemImage: {
      width: cardwidth - 90,
      height: 210,
      marginLeft: 5,
      marginRight: 5
    },
    nameView: {
      width: '50%',
      margin: 10,
      height: 90
    },
    priceView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameText: {
      fontSize: 18,
      color: COLORS.dark,
      fontWeight: '500',
      marginBottom: 10
    },
    descText: {
      fontSize: 18,
      color: COLORS.dark,
      fontWeight: '600',
      marginBottom: 10
    },
    priceText: {
      fontSize: 16,
      color: COLORS.dark,
      fontWeight: '700',
      marginBottom: 5
    },
    discountText: {
      fontSize: 16,
      color: "green",
      fontWeight: '700',
      textDecorationLine: 'line-through',
      marginLeft: 5,
      marginBottom: 5
    },
    addRemoveView: {
      flexDirection: 'row',
      alignItems: 'center',
      textAlign: 'center'
    },
    addToCartBtn: {
      padding: 10,
    },
    checkoutView: {
      width: '100%',
      height: 60,
      backgroundColor: COLORS.background,
      position: 'absolute',
      bottom: 60,
      elevation: 5,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    checkButton: {
      width: cardwidth,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.dark,
  
    }, bottoms: {
      flexDirection: "row",
      backgroundColor: COLORS.white,
      height: 150,
      bottom: 0
    },
    total: {
      width: '90%',
      height: 60,
      backgroundColor: COLORS.white,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
  
    },
    image: {
      position: "relative",
      height: cardheight - 130,
      width: cardwidth,
    },
    Name: {
      fontSize: 14,
      fontWeight: 'bold',
      color: "#131A2C",
      marginTop: 5,
      marginLeft: 10,
      marginBottom: 5,
      height: 40,
      width: cardwidth - 20
    },
  });

 export const Addproduct =(COLORS)=> StyleSheet.create({
    Addproduct: {
        width: '100%',
        height: 60,
        backgroundColor: COLORS.background,
        position: 'absolute',
        bottom: 60,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    Addproductbutton: {
        width: cardwidth,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark,
    },
});