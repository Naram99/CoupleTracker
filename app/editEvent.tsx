import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import EventForm from "./components/events/EventForm";

export default function EditEvent() {
    const { eventId } = useLocalSearchParams();

    return <EventForm eventId={Number.parseInt(eventId as string)} />;
}

const styles = StyleSheet.create({});
