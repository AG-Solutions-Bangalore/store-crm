import { Card, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { WEBSITE_ENQUIRY } from "../../api";
import usetoken from "../../api/usetoken";
import WebsiteTable from "../../components/websiteenquiry/WebsiteTable";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Search } = Input;
const WebsiteEnquiry = () => {
  const token = usetoken();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [website, setWebsite] = useState([]);

  const fetchUser = async () => {
    const res = await trigger({
      url: WEBSITE_ENQUIRY,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setWebsite(res.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredUsers = website
    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();

      const matched = flatString.includes(searchTerm.toLowerCase());

      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#006666]">Website Enquiry</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <WebsiteTable website={filteredUsers} />
        ) : (
          <div className="text-center text-gray-500 py-20">No users found.</div>
        )}
      </div>
    </Card>
  );
};

export default WebsiteEnquiry;
