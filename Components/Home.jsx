import React, { useContext, useState } from "react";
import Banner from "./Banner";
import TagBadges from "./TagBadges";
import { AuthContext } from "./AuthContext";
import PostLists from "./PostLists";
import Announcements from "./Announcements";
import LoadingSpinner from "./LoadingSpinner";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [selectedTag, setSelectedTag] = useState(""); // state lifted here


    return (
        <div className="space-y-2">
            <Banner selectedTag={selectedTag} />
            <TagBadges onTagClick={(tag) => setSelectedTag(tag)} />
            <PostLists user={user} />
            <Announcements />
        </div>
    );
};

export default Home;
