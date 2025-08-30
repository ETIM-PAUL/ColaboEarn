import { BigNumber, ethers } from 'ethers';
import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import { abi, contractAddress } from '../components/utils';

// Create the context
export const PostsContext = createContext();

// Create the provider component
export const PostsProvider = ({ children }) => {
  const [forYouPosts, setForYouPosts] = useState([]
    );
  const [themes, setThemes] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [allUsers, setAllUsers] = useState([]);


  const setAllThemes = (themes) => {
    setThemes(themes);
  };

  const setAllContributions = (contents) => {
    setForYouPosts(contents);
  };

  const updateContributionStatus = (id, status) => {
    setForYouPosts(prevPosts =>
      prevPosts.map(post =>
        Number(post.id) === Number(id)
          ? { ...post, approved: status }
          : post
      )
    );
  };

  const setCoinsDetails = (coinsDetails) => {
    setCoinDetails(coinsDetails);
  };

  const setPlatformUsers = (allUsers) => {
    setAllUsers(allUsers);
  };

  const addCoinDetails = (newCoinDetails) => {
    setCoinDetails((prevCoinDetails) => [...prevCoinDetails, newCoinDetails]);
  };

  async function getThemeInfo(link) {
    const url = link;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const getAllThemes = async () => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      // Call the getAllThemes function
      const allThemes = await contract.getAllThemes();

      // Map each theme to a promise that resolves to the formatted object
      const formattedThemes = await Promise.all(
        allThemes.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsUrl);
          return {
            id: BigNumber.from(element?.id._hex).toString(),
            nftImg: res?.image,
            theme: res?.theme,
            description: res?.description,
            amount: BigNumber.from(element?.tips._hex).toString(),
            creator: element?.creator,
            category: res?.category,
            type: element?.contentType,
            collaborators: BigNumber.from(element?.collaborators._hex).toString(),
            maxCollaborators: BigNumber.from(element?.maxCollaborators._hex).toString(),
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );

      setAllThemes(formattedThemes);
      return formattedThemes;

    } catch (error) {
      console.error('Error fetching coin addresses:', error);
      throw error;
    }
  };

  const getAllContributions = async (themes) => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);
  
      // Call the getAllCoins function
      const allContributions = await contract.getAllContributions();

      // Map each theme to a promise that resolves to the formatted object
      const formattedContents = await Promise.all(
        allContributions.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsLink);
          return {
            id: BigNumber.from(element?.id._hex).toNumber(),
            nftImg: res?.image,
            theme:  BigNumber.from(element?.themeId._hex).toString(),
            type: themes.find((item) => item?.id === BigNumber.from(element?.themeId._hex).toString())?.type,
            title: res?.name,
            description: res?.description,
            approved: element?.approved,
            creator: element?.creator,
            content:res?.content,
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );


      setAllContributions(formattedContents);
    } catch (error) {
      console.log('error', error);
    }
  }
  
  const getUpdatedContributions = async () => {
    try {
      // Initialize provider and contract
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const contract = new ethers.Contract(contractAddress, abi, provider);
  
      // Call the getAllCoins function
      const allContributions = await contract.getAllContributions();

      // Map each theme to a promise that resolves to the formatted object
      const formattedContents = await Promise.all(
        allContributions.map(async (element) => {
          const res = await getThemeInfo(element?.ipfsLink);
          return {
            id: BigNumber.from(element?.id._hex).toNumber(),
            nftImg: res?.image,
            theme:  BigNumber.from(element?.themeId._hex).toString(),
            type: themes.find((item) => item?.id === BigNumber.from(element?.themeId._hex).toString())?.type,
            title: res?.name,
            description: res?.description,
            approved: element?.approved,
            creator: element?.creator,
            content:res?.content,
            date: BigNumber.from(element?.dateCreated._hex).toString(),
          };
        })
      );


      setAllContributions(formattedContents);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    getAllThemes().then((res) => getAllContributions(res));
  }, [])
  

  const approvedPosts = forYouPosts.filter((item) => item.approved === true);

  return (
    <PostsContext.Provider value={{ forYouPosts, approvedPosts, themes, updateContributionStatus, setAllThemes, setAllContributions, setCoinsDetails, addCoinDetails, coinDetails, setPlatformUsers, allUsers, getUpdatedContributions }}>
      {children}
    </PostsContext.Provider>
  );
}; 