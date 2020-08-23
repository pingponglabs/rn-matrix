import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import BottomSheet from 'react-native-actions-sheet';
import {
  addHasReachedTopListener,
  removeHasReachedTopListener,
} from 'react-native-actions-sheet';

export default function ActionSheet({
  children,
  visible = false,
  innerScrollEnabled = true,
  gestureEnabled = true,
  onClose = () => {},
  style = {},
}) {
  const [nestedScroll, setNestedScroll] = useState(false);
  const actionSheetRef = useRef(null);

  const _onHasReachedTop = () => {
    setNestedScroll(true);
  };

  useEffect(() => {
    if (innerScrollEnabled) {
      addHasReachedTopListener(_onHasReachedTop);
    }
    return () => {
      if (innerScrollEnabled) {
        removeHasReachedTopListener(_onHasReachedTop);
      }
    };
  }, [innerScrollEnabled]);

  useEffect(() => {
    if (visible) {
      actionSheetRef.current.setModalVisible(true);
    } else {
      actionSheetRef.current.setModalVisible(false);
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={actionSheetRef}
      bounceOnOpen
      bounciness={8}
      gestureEnabled={gestureEnabled}
      onClose={onClose}
      containerStyle={{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        ...style,
      }}>
      <ScrollView
        nestedScrollEnabled
        scrollEnabled={nestedScroll}
        style={{width: '100%', maxHeight: 600}}>
        {children}
      </ScrollView>
    </BottomSheet>
  );
}
