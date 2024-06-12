import { Dimensions, StyleSheet } from "react-native";
import COLORS from "./Color";

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const Homestyles = StyleSheet.create({
    cardView: {
        marginBottom: 20,
        marginTop: 5,
        marginRight: 5,
        borderRadius: 5,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: 'white',
    },
    discoverButton: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: '#ECF0F1',
    },
    discoverText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
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

    },
    image: {
        position: "relative",
        height: cardheight - 80,
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
    Text: {
        color: COLORS.darkblue,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    headerTextView: {
        backgroundColor: 'White',
        // marginTop: 10
    },
    smallCard: {
        // borderRadius: 30,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 70,
        borderBottomColor: "transparent",
        borderBottomWidth: 2,
    },
    smallCardSelected: {
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 70,
        shadowColor: "black",
        borderBottomColor: "black",
        borderBottomWidth: 2,
    },
    smallCardTextSected: {
        color: "#131A2C",
    },
    regularText: {
        fontWeight: "normal",
        fontSize: 16,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
    },

    smallCardText: {
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginTop: 5,
    },
});
export default Homestyles;

export const card = StyleSheet.create({
    cardView: {
        marginHorizontal: 1,
        marginBottom: 30,
        marginTop: 0,

        width: cardwidth,

        height: 370,
        elevation: 13,
        backgroundColor: "white",
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

        backgroundColor: "black",

        marginHorizontal: 5,
    },
    activeDot: {
        marginBottom: 20,
        backgroundColor: "white",
    },
    Name: {
        fontSize: 14,

        color: "#131A2C",
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
    },
    offer: {
        fontSize: 12,
        fontWeight: "bold",
        marginHorizontal: 9,
        color: "#df2600",
        height: 40
    },
    price: {
        fontSize: 18, fontWeight: "bold", marginHorizontal: 10
    }
});

export const productpage = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: "#FBFAFF",
        height: 35,
        bottom: 20,
    },
    Textt: {
        color: COLORS.darkblue,
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
        backgroundColor: "black",
        marginHorizontal: 5,
    },
    activeDotDetails: {
        marginBottom: 20,
        backgroundColor: "white",
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
        borderColor: "black",
    },
    blackButtonStyle: {
        borderWidth: 2,
        borderColor: "#df2600",
    },
    sizeButton: {
        width: 55,
        height: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 3,
    },
    sizeButtonText: {
        position: "relative",
    },
    selectedSizeButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "black",
    },
    sizeText: {
        fontSize: 15,
        color: "black",
    },
    NameD: {
        fontSize: 14,
        color: "#131A2C",
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 0,
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
    },
    bottomBar: {
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderColor: "#cccccc",
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
        backgroundColor: "black",
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
        backgroundColor: "black",
        paddingHorizontal: 20,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
        width: width - cardwidth / 2,
    },
    addToCartBton2: {
        backgroundColor: "black",
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
        color: "black",
    },
    reviewContainer: {
        backgroundColor: "rgb(250, 250, 250)",
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
    },
    addToCartButtonText: {
        color: "white",
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    okButton: {
        backgroundColor: "black",
        padding: 5,
    },
    okButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export const smallCard = StyleSheet.create({
    header: {
        flexDirection: "row",
        backgroundColor: "#FBFAFF",
        height: 60,
    },
    smallCard: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 60,
        borderBottomColor: "transparent",
        borderBottomWidth: 2,
    },
    smallCardSelected: {
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 60,
        shadowColor: "black",
        borderBottomColor: "black",
        borderBottomWidth: 2,
    },
    smallCardTextSected: {
        color: "#131A2C",
    },
    smallCardText: {
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginTop: 5,
    },
    regularText: {
        fontWeight: "normal",
        fontSize: 16,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 18,
    },

});

export const filter = StyleSheet.create({
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
        // backgroundColor: '#E9ECEF',
        // borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        // flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#393e46',
    },
    dropdownButtonArrowStyle: {
        fontSize: 22,
        marginLeft: 5
    },
    // dropdownButtonIconStyle: {
    //   fontSize: 18,
    //   marginRight: 8,
    // },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        // width: '100%',
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
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    dropdownItemTxtStyle: {
        // flex: 1,
        fontSize: 16,
        // fontWeight: '500',
        color: '#151E26',
    },
})