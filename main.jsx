import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollViewBase,
  Image,
} from "react-native";
import fApp from "./firebase";
import { AuthContext } from "./auth-contex";
import { getDatabase, ref, set, onValue } from "@firebase/database";
import { getAuth } from "@firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./profile";
// import Home from "./main";
import Quiz from "./quiz";
const BtmTabnav = createBottomTabNavigator();

function Main() {
  const [user, setUser] = React.useContext(AuthContext);
  return (
      <NavigationContainer>
        <BtmTabnav.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#008080",
            tabBarInactiveTintColor: "white",
            tabBarStyle: { backgroundColor: "black" },
          }}
        >
          <BtmTabnav.Screen
            name="Home"
            component={Quiz}
            options={{
              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <Image
                    style={{ width: size, height: size }}
                    source={{
                      uri: "data:image/png;base64,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",
                    }}
                  />
                );
              },
            }}
          />
          <BtmTabnav.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ size, focused, color }) => {
                return (
                  <Image
                    style={{ width:size , height: size }}
                    source={{
                      uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRYVFRYYGRgaFRgSGhoZFBIZHB4aGBkZGhgYGhkcIS4lHB4rHxgaJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMBgYGEAYGEDEdFh0xMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAwECBgcIBQT/xABEEAACAQICBwQFCQUHBQAAAAABAgADEQQhBQYHEjFBUSJhcYETMlKRoRRCYnKCkrHBwiMzQ6LwJFOTo7LR8RU0Y9Lh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANMwBK2MmTgPx6QCjLlfgD+Usd+Qh24i3PORwEREBERAREQERECckWB/CRO95beICIiAiIgIiBAASVUsc7eEejtfn0lWa3u90C2oR1vI4iAiIgIiICIiBJSblKM/lLIgIiICIiAiIgIlwQ5d8tgIiICIiAiIgIiICShOBHjIpeGyIgXu1r9T8JDEQEREBERAREQEREBERAREQEREBKqpPCXBeBMktYc7cbwAy8LSJ2vDtcz3tWtUMXjmtQpncvZqjdmmvi3M9y3PdAx+S0aLOwVVZmOQCqST4AZmb20BsgwlEb+Lc12GZFzTpi3gd4+JIHdPUxOuuiNHqUotTuOKYamrXI43ZbLfxaBpbBahaSqi6YSqB9MLT+DkT2KWyTSZ4pTX61ZP03mV6Q23qDajhGI9qpVCn7ig/wCqeNX214w+rQw6+Iqt+sQPOfZFpIcEpN4Vl/O08vG7PNJ0wS2EcgewUqe4IxPwmSUttWNHrUcO3gtVf1metgtt+YFbCZc2p1s/JWX9UDUOKwtSm27Upujcd10ZT7mF5BOjMJtF0VjF9HXIS+RTE0l3fNu0g8yJ8+mdlWAxK+kwzehLC6tTIeme/cJtb6pEDnuJletOoeMwN2qJv0v72ndl+1ldPMW6EzFICIiAiIgIiVsYAcZKUFj/AFbuhQB42v3SxiOAgU3O8e+JbEBERAREQEqq3lyDrJBYXy/+wLN4jImLFjYAkkgAcSTwGXWM2IAGZNgBckk/iZvjZvqAmDQYzGBfT7u+A1t2gtrkknLftxPzfeYHi6h7KLha+kFI+cuH4G3I1SOHXdGfXmJkWte0nCYFfk+FVatRBuBKe6tGnbLdYrzHsr0IJEw3aJtOauWw+Cdko5h6guGqdQp4qnxPcMjq2BkGsWt2LxpPyisxW9xTXs0x0sg426m575j8RAREAQElW1hfxEBLcc+glWa1suXugW1LX53npaD1ixOEbew9Z0zuVBup+shybzE8mIG+dUtrNCvajjVWi5G7v/wW5dq+aX77jvEi132U06wavgAqPbe9CCBTfn+zPBGPIerw9XjNFzP9QNo1XBMKVYtUwxNt3i1P6VMnl1Xh0tzDBsVhnpuyOpR1JVlYEEEcQQeEhnReumqGH0rQXE4Zk9Nub1OqvquB8x/wuc1PmJz3jMI9J2p1FKujFWUixBHEGBBEStjAoJOOOVvCUVMuGcjva4gXM/IXtI4iAiIgIiICXUxnLRJyRx91vzgBkOPO9/ykbNfwhmv4T3dSdXmx2Lp0Bfdvv1CPm01tvHxNwo72EDYWxvUsNu6QrrkCfk6kZXGRqkdxuF7wT0M+Dazr4a7PgsO37FWtUcH946nNQfYB95HQC+Y7U9ZBgcGmFw9kqVE9EgXL0dFRusy24G1lHmR6s57gIiICX00LEKoJJIAABJJPAAczLJ0Bsv1BXCouKxCg4hhvKGH7pWGQA9sjieV7DncMN1Y2RYiuFqYpvk6Gx3N3eqkd44J53PUTPsFsm0ai2dKlQ8y9ZwT5JuiZ9EDBcTsp0YwstJ0NvWSvVJHhvlh8JhGsexqqgZ8HV9KBn6Opuq/k47LHxCzeQErA45xWGem7JUVkZTZlYFWB6EHhIZ0ttD1Hp4+kWUBcSi/s34bwGfo6nVTyPzSb8Lg834iiyMyMpVlYoyniGU2YHvBECGIiBnWzXXhsDVFKqScNUYbw47jHL0ijp7Q5jvAmwNrWpq4mj8uw4BqogZ92xFSkBfeFuLKMwea5Z2E0LN37Fday6HAVWuyKXoknMp86nn7N7juJHBYGkd3K8mUWuL8sx/tMx2masfIcYfRqBRrXq0xwAz7dMfVJFu5lmFu/IcIFHPACWREBERAREQEREBF4iAm+9iehBRwj4txZqxNieVKmSOfC7bx8As0TQpM7Kii7MwRR1LGwHvM6J19xAwGh2oobH0aYJDexO8u6x8dxXMDSGuunjjcZWr3O6W3KYN8qa5ILcrjtHvYzwIiAiIgZvsn0EMTj0Li6UVOIYEZEqQEU/bYG3MKZ0kZqDYFhgExlTiS1FPIBm/V8Jt+AlwEASsBERATQm3DQIpYmniVFlrqQ9hl6RLAk9LqV+6xm+5rXblhw2j0bmmJRh9pXUj4j3QOfYiICfdoXST4evSr0z26bioO+3FT3EXB7iZ8MQOi9omj00hor09LMoi4ykbZ7u7d1+4Wy6qJzpOgNielfTYF8O5uaFQrY/wB3Uuy3+16QeU0nrHo04bFV8PnanVemt+JUMdw+a2PnA8uIiAiIgIiICJczXlsBERAybZzgxV0nhFPAVhU/wwag+KzYe3/GkLhKA4FqlZvFQqr/AKnmKbFqV9KIfZpVW/l3f1T0tvVa+NoJ7OGDfeqP/wCsDV8REBERA3LsAxP/AHlI/wDiqD+dW/TNzATm7Y/pT0OkqanJayNhznzNmTzLIo+1OkoCIiAiIgJrHbvit3A0qfN8Qp+yiOT8Ss2dND7ddJh8XQw4zFKkXax+fVIyt9VEP2oGq4kpp5ZdZERAREQNobB8aVxtal82phy32qbru/B2nn7acGE0mzD+JRp1T4gGn+gT5tj9bd0rhx7S1U/y3b9MyDb7TticM3Wgy/dcn9UDVEREBERAREQEREBERAz7Yq9tJoPao1R/Lf8AKejt5pWx1Fvawyj7tSp/vMa2ZYsU9J4RibA1DT/xEZAPewmd7f8ABn+x1gMv2tInv7DIP9fugaaiSqBlfjx/5lrKBz+ECyIiBNhMQ1N0qIbMjLUU9GUhlPvE6z0BpVMVh6OIT1aiB7X4NwZD3qwKnvE5Gm4NiGs4VnwFQ5MTVokn51u2nmBvAdzdYG7IiICIlDAgxWJWmj1HYKiKzsx4BVBLE+ABnKesGlDicVXxDXBqOz25hOCL4hQo8puLbRrN6KiMFTbt1hvVLHNaQPDxYi3grdZohn5CALZWEsiICIiBmuyGlvaVw/0RVb/KcfnMj2+v/aMKvSgze97fpnx7C8GWx1SpbKnh2z6M7KF+Ab3T5tt2LD6S3Qf3dCnTI6E7z/g4ga8iJcUOfdAtiIgIiICIiAiIgT4LEtTqJUX1kdai+KkMPiJ0LtPwi4zRJrU+0FFPGpb2N3tHw3HY+U53Ui3TynQGyHSq4nANhqnaajeiwPE0qgJS/dYsv2YGgHIHLlIp62s+hmwmKrYdr9hyFJ5oc0bzUgzyYCIiAk2Grsjq6MVdGV1YcQykFSO8ECQzM9Q9Rq+OqK5Uphg13qHIMFPaSn7THMXGQzv0IdHaMxJqUaVQixemjkdCygkfGfXI6aAAACwAAA6AcBLiYFSZSUlQIHJms2kXr4rEVXPaas/kAd1V8AoA8p5E2VtP1DrUK1XFUUL4d2aq26LmkWzYMOO5e5DcAMja2etYCIiAiJ9OBwj1qiUqYu7uqKOrMbD8YG8NhWivR4StiGFjWqbqn6FIEX+8zj7M0/rdpP5TjcTXBur1nKH6CndT+VVm+NbMQui9DmlTazCkMJTOQJdwQz+Nt9vKc5Ko5/8AECiLfwkhYi9/L+ukE2te/TuMgJgVJvKREBERAREqBeAUXkiJzMKtszfjbL8ZVza/XhAtqZG4+EyfZ3rL8hxqVGP7J/2NX6jEdrxVgG8ARzmKRA3xtn1X9PQXG0QC9FbPb51HjvC3HdJv4Mx5TQ83pse1wWtTGArsPSIpFHe+fTAzp58WUXy9n6pmFbUNSGwVU1qS3w1RuzYfu2Ofo27uO6emXLMMAmf6rbLsXi1FRyMPSYXDOpLsORWmLZeJHdeejsb1RXEVHxdZQ1OkwRFIuGq2DEkcwoINuZYdJvyBgGr+yrA4chnVsQ4zvVtuX7qYyI+tvTO0QAAAAACwAFgAOAAkkQKEy2VIi0BaViVgJhWsWzbAYolzTNFzmXo2S543ZbFT3m1++ZrEDn7WTZDiqCl8O4xCjMqFKVLdyXIbyNz0mt3QgkEEEGxBFiCOIInZM05tp1QTc/6hRUKQQtcAWDBiFWp9beIU9d4HkYGlpuDYjqqSx0hVXsrvU6APNsw7+AzUHqW6TCtQtUX0hXC5rRQhqtToPYX6TcB048rHbm0XWino7CrhcPZKzoEpqv8ADpjs7/cciF6m55GBrza9rJ8qxfoKbXpYfeQZ5NUP7w99rBR9U9ZgC1Ov/MrvWHDyvIibwKExEQEREBERASUJY9ZLQwTOjuu7uoAWuyg5kAWUm5zMg38gIF7Nbnn/AFxkJMGICIiBNhcS1N1dGKujBlYGxBBuCDOhdStbqGlcO2GxKp6bc3atM2tUX20/EgZqfIznST4TFPSdalNijqQyspIII5gwOrNWNBU8Fh1w9IkqrOwLWv23ZgCRxIBC3+jPZmrtQ9qVPEBaGMK063qrU9Wm/S/JG+BPC17TaMBERAREQEREBERATz9N6OXEYetQY2WpTamTa5G8CAwHUHPynoTANedo9DBBqVErVxPq7oN0Q9ajDmPZBv1txgT6Z0rhNCYNadNRvWIp079p251HPG1+LeAHITn7TGlKmIrPXrsXdzdunQBeigZAd0aY0pUxFV61dy9RuJPDuUDgFHIDKeaxvAE3lIiAiIgIiICIiBkGhnth8QO16jGwDZ9kLkQpFgXBa54W4cZj8yDRDD5LiFNr+sMlPzTfndcri+XG3auVmPwEREBERAREAQLlGczbVPaFjMCFS4rURl6N2PZA4BH4r4ZjumGqtr58rHuljNlYQOktXtpeBxQANT0FQ5blYhRf6L+qfeD3TM0cEAggg5gg3HvnG89TRWn8Thj/AGfEVaYvfdV2Ck96eqfMQOuInOeC2u6SQWZqVXvqUgD/AJZWevS224kethqJ8GqL+JMDesTRb7bcR83DUh4vUP4WnlYzbBpFwQvoafQpSJI++zD4QOiJimsG0DAYS4esHcfw6Vna/Q2O6p8SJzxpbWjGYm4r4mq6niu+VT7i2X4TxoGw9a9quKxN0o/2ekcuwxNQj6T5WHcoHiZryIgVJvKREBERAREQERJFyGfPlAt3T0PuiT739WMQPQ0VWYUqyg8QedXsgqQ5KqjKwK5drha4txnjT39B73oMTctu7hsBv23t07xsBYgDdvfIXU8gR4EBERAREWgXKLm0lAtfkPHMS30eXfI97K0C925fG0jiICIiAiIgIAiXotz3QKFTn3S2TFssx75CTAREQEREBERASoF5SSKbZEcfKBUJb8pVmI6X5yjNbh7uMigXb56xLYge5oWgrUcSWPq0yyi7izBW7WXZOVxzPHle/hz1tHY9UpVkYtd0IUWBS5Frtzva9rZXtfhceTAREuVSeEC0CTrw491+ndKIMh4+6Wu3EZd8A7dDI4iAiIgIiICIl6qeIgVVBwPHxl5a3Hpa0tFTje3hbjIiYAmIiAiIgIiICBEm3Le7K8CgSxGfhKVCJczW/rhIYCIiAiIgIiICS0ufiIiBe/PwnzxEBERAREQEREBJk4eRiIETcZSIgIiICIiAiIgBJ34N4/7SsQPniIgIiICIiB//2Q==",
                    }}
                  />
                );
              },
            }}
          />
        </BtmTabnav.Navigator>
      </NavigationContainer>
  );
}

export default Main;
