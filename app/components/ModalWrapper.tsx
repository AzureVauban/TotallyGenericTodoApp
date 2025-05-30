import React from "react";

import {
  Modal,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { styles as sharedStyles } from "../theme/styles";

interface ModalWrapperProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  contentStyle?: object;
  overlayStyle?: object;
  animationType?: "none" | "slide" | "fade";
  transparent?: boolean;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onRequestClose,
  children,
  contentStyle = {},
  overlayStyle = {},
  animationType = "fade",
  transparent = true,
}) => (
  <Modal
    visible={visible}
    transparent={transparent}
    animationType={animationType}
    onRequestClose={onRequestClose}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <View style={[sharedStyles.modalOverlay, overlayStyle]}>
        <TouchableWithoutFeedback>
          <View style={[sharedStyles.modalContent, contentStyle]}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default ModalWrapper;
